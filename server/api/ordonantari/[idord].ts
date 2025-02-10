import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const id = Number(event.context.params?.idord)
    
    try {
      const ordonantari = await prisma.$queryRaw`
     SELECT 
          op.*,
          f.denumire as furnizor_denumire,
          f.codfiscal as furnizor_codfiscal,
          f.adresa as furnizor_adresa,
          f.iban as furnizor_iban,
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
            select concat(m.codang,'-',m.indicator) from ModificariAngajamente m
            where m.idAngajament = a.id
            limit 1
          ) as codang_indic,
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
        WHERE op.id = ${id} 

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

  if (event.method === 'DELETE') {
    try {
    const id = Number(event.context.params?.idord)
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID provided'
      })
    }

    // First, delete all related records in ReceptiiOrdonantari
    await prisma.receptiiOrdonantari.deleteMany({
      where: {
        idOrdonantare: id
      }
    })

    // Then delete the OrdonantariPlata record
    const deletedOrdonantare = await prisma.ordonantariPlata.delete({
      where: {
        id: id
      }
    })

    return {
      success: true,
      data: deletedOrdonantare
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Could not delete ordonantare'
    })
  } finally {
    await prisma.$disconnect()
  }
  }
})
