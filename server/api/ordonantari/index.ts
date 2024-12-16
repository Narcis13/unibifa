import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {

    const query = getQuery(event)
    
    const from = query.from!.toString().replace(/\//g, '-')
    const to = query.to!.toString().replace(/\//g, '-')
    let todate = new Date(to)
    todate.setDate(todate.getDate() + 1)

    // Use Prisma's aggregation and grouping for better performance
    let operatorSql;
    if (query.sumaoperator) {
      switch (query.sumaoperator) {
        case 'eq':
          operatorSql = Prisma.sql`=`;
          break;
        case 'lt':
          operatorSql = Prisma.sql`<`;
          break;
        case 'gt':
          operatorSql = Prisma.sql`>`;
          break;
        default:
          operatorSql = Prisma.sql`>`;
      }
    }
    try {
      const ordonantari = await prisma.$queryRaw`
     SELECT 
          op.*,
          f.denumire as furnizor_denumire,
          f.codfiscal as furnizor_codfiscal,
          f.adresa as furnizor_adresa,
          f.iban as furnizor_iban,
          comp.id as idCompartiment,
          comp.denumire as compartiment,
          (
            SELECT COALESCE(SUM(
              CASE 
                WHEN m.tipModificare = 'MAJORARE' THEN m.suma 
                WHEN m.tipModificare = 'DIMINUARE' THEN -m.suma 
              END
            ), 0)
            FROM ModificariAngajamente m
            WHERE m.idAngajament = a.id
          ) as total_modificari,
          (
            SELECT COALESCE(SUM(r2.valoare), 0)
            FROM Receptii r2
            WHERE r2.idAngajament = a.id
            AND EXISTS (
              SELECT 1 
              FROM ReceptiiOrdonantari ro2
              JOIN OrdonantariPlata op2 ON ro2.idOrdonantare = op2.id
              WHERE ro2.idReceptie = r2.id and op2.created_at<op.created_at
            )
          ) as total_receptii_ordonantate,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', r.id,
              'nrfact', r.nrfact,
              'datafact', r.datafact,
              'valoare', r.valoare,
              'compartiment', comp.denumire,
              'angajament', JSON_OBJECT(
                'id', a.id,
                'numar', a.numar,
                'data', a.data,
                'descriere', a.descriere,
                'modificari_totale', (
                  SELECT COALESCE(SUM(
                    CASE 
                      WHEN m.tipModificare = 'MAJORARE' THEN m.suma 
                      WHEN m.tipModificare = 'DIMINUARE' THEN -m.suma 
                    END
                  ), 0)
                  FROM ModificariAngajamente m
                  WHERE m.idAngajament = a.id
                ),
                'total_receptii_ordonantate', (
                  SELECT COALESCE(SUM(r2.valoare), 0)
                  FROM Receptii r2
                  WHERE r2.idAngajament = a.id
                  AND EXISTS (
                    SELECT 1 
                    FROM ReceptiiOrdonantari ro2
                    JOIN OrdonantariPlata op2 ON ro2.idOrdonantare = op2.id
                    WHERE ro2.idReceptie = r2.id and op2.created_at<op.created_at
                  )
                ),
                'categorie', JSON_OBJECT(
                  'id', c.id,
                  'denumire', c.denumire,
                  'sursa', JSON_OBJECT(
                    'id', sf.id,
                    'denumire', sf.denumire,
                    'cod', sf.cod,
                    'scurt', sf.scurt
                  ),
                  'articol', JSON_OBJECT(
                    'id', ab.id,
                    'denumire', ab.denumire,
                    'cod', ab.cod
                  )
                )
              )
            )
          ) as receptii
        FROM OrdonantariPlata op
        LEFT JOIN furnizori f ON op.idFurnizor = f.id
        LEFT JOIN ReceptiiOrdonantari ro ON op.id = ro.idOrdonantare
        LEFT JOIN Receptii r ON ro.idReceptie = r.id
        LEFT JOIN compartimente comp ON comp.id = r.idCompartiment
        LEFT JOIN Angajamente a ON r.idAngajament = a.id
        LEFT JOIN Categorii c ON a.idCategorie = c.id
        LEFT JOIN sursefinantare sf ON c.idsursa = sf.id
        LEFT JOIN articolebugetare ab ON c.idarticol = ab.id
        WHERE op.stare = 'activ' AND
        op.dataord >= ${new Date(from)}
        AND op.dataord < ${todate}
        ${query.compartiment ? Prisma.sql`AND r.idCompartiment = ${Number(query.compartiment)}` : Prisma.sql`AND r.idCompartiment > 0`}
        ${query.sursa ? Prisma.sql`AND c.idsursa = ${Number(query.sursa)}` : Prisma.sql`AND c.idsursa > 0`}
        ${query.artbug ? Prisma.sql`AND c.idarticol = ${Number(query.artbug)}` : Prisma.sql`AND c.idarticol > 0`}
         ${query.furnizor ? Prisma.sql`AND op.idFurnizor = ${Number(query.furnizor)}` : Prisma.sql`AND op.idFurnizor > 0`}
         ${query.sumaoperator ? Prisma.sql`AND op.valoare ${operatorSql} ${Number(query.sumavalue)}` : Prisma.sql``}
         ${query.viza === 'true' ? Prisma.sql`AND op.vizaCFPP=1` : 
          query.viza === 'false' ? Prisma.sql`AND op.vizaCFPP=0` : 
          Prisma.sql``}
        GROUP BY op.id, r.id
        ORDER BY comp.denumire ASC,op.dataord DESC
      `
  
      // Transform the results to parse JSON strings
      const formattedOrdonantari = ordonantari.map((ord: any) => ({
        ...ord,
   
        receptii: typeof ord.receptii === 'string' 
          ? JSON.parse(ord.receptii) 
          : ord.receptii,
          primareceptie:typeof ord.receptii === 'string' 
          ? JSON.parse(ord.receptii) [0]
          : ord.receptii[0],

      }))
  
      return {
        success: true,
        data: formattedOrdonantari
      }
    } catch (error) {
      console.error('Error fetching ordonantari:', error)
      return {
        success: false,
        error: 'Failed to fetch ordonantari'
      }
    }
   
  }

  if (event.method === 'POST') {
    try {
        const body = await readBody(event)
        const { idFurnizor, receptii, valoare, explicatii } = body
    
        if (!idFurnizor || !receptii || !Array.isArray(receptii) || receptii.length === 0 || typeof valoare !== 'number') {
          throw createError({
            statusCode: 400,
            message: 'Invalid request parameters'
          })
        }
    
        // Calculate next ordonantare number
        const currentYear = new Date().getFullYear()
        const lastOrdonantare = await prisma.ordonantariPlata.findFirst({
          where: {
            numar: {
              startsWith: `O${currentYear}`
            }
          },
          orderBy: {
            numar: 'desc'
          }
        })
    
        const nextNumber = lastOrdonantare 
          ? parseInt(lastOrdonantare.numar.split('-')[1]) + 1 
          : 1
        const ordonantareNumber = `O${currentYear}-${nextNumber.toString().padStart(5, '0')}`
    
        // Verify all receptii exist and sum matches
        const receptiiDetails = await prisma.receptii.findMany({
          where: {
            id: {
              in: receptii
            }
          },
          select: {
            id: true,
            valoare: true,
            ordonantari: true
          }
        })
    
        // Check if any reception is already linked to an ordonantare
        const alreadyOrdonantated = receptiiDetails.some(r => r.ordonantari.length > 0)
        if (alreadyOrdonantated) {
          throw createError({
            statusCode: 400,
            message: 'One or more receptions are already linked to an ordonantare'
          })
        }
    
        // Verify total matches provided value
        const calculatedTotal = receptiiDetails.reduce(
          (sum, reception) => sum + reception.valoare.toNumber(),
          0
        )
    
        if (Math.abs(calculatedTotal - valoare) > 0.01) { // Allow for small floating point differences
          throw createError({
            statusCode: 400,
            message: 'Provided value does not match sum of receptions'
          })
        }
    
        // Create ordonantare and link receptii in a transaction
        const result = await prisma.$transaction(async (tx) => {
          // Create the ordonantare
          const ordonantare = await tx.ordonantariPlata.create({
            data: {
              numar: ordonantareNumber,
              idFurnizor: idFurnizor,
              valoare: valoare,
              explicatii: explicatii || null,
              receptii: {
                create: receptii.map(idReceptie => ({
                  idReceptie
                }))
              }
            },
            include: {
              furnizor: true,
              receptii: {
                include: {
                  receptie: true
                }
              }
            }
          })
    
          return ordonantare
        })
    
        return {
          success: true,
          data: result
        }
    
      } catch (error) {
        console.error('Error creating ordonantare:', error)
        throw createError({
          statusCode: error.statusCode || 500,
          message: error instanceof Error ? error.message : 'Failed to create ordonantare'
        })
      }
  }

  if(event.method==='PATCH'){
    const body= await readBody(event)
   // console.log(body)

 await prisma.ordonantariPlata.update({
      where: {
        id:body.idOrdonantare
      },
      data: {
        vizaCFPP:true, 
        nr_viza:body.nrvizac,
        dataCFPP:body.dataviza
      },
    });
  }
})
