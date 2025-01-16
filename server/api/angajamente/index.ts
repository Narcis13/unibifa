import { PrismaClient ,Prisma} from '@prisma/client'
import type { CreateAngajamentDTO } from '~/types/angajamente'
const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    /*
    const query = getQuery(event)
    const exercitiuBugetar = Number(query.an) || new Date().getFullYear()
    const from=query.from!.toString().replace(/\//g, '-')
    const to=query.to!.toString().replace(/\//g, '-')
    let todate = new Date(to); // Get the current date
    todate.setDate(todate.getDate() + 1); // Add one day
    let whereClause = {
      data: {
        gte: new Date(from),
        lt: todate
      }
    }

  
    if ('compartiment' in query) {
      whereClause.idCompartiment = Number(query.compartiment)
    } else {
     
      whereClause.idCompartiment = { gt: 0 }
    }


      
    console.log('from',from,to,new Date(to))
    return await prisma.angajamente.findMany({
      where: whereClause,
      include: {
        categorie: {
          include: {
            sursaFinantare: true,
            articolBugetar: true
          }
        },
        compartiment: true,
        modificari: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })*/

    const query = getQuery(event)
    const exercitiuBugetar = Number(query.an) || new Date().getFullYear()
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

    const angajamenteWithCounts = await prisma.$queryRaw`
      SELECT 
        a.*,
        COUNT(m.id) as totalModificari,
        COUNT(CASE WHEN m.vizaCFPP = true THEN 1 END) as totalVizate,
        SUM(CASE WHEN m.tipModificare = 'MAJORARE' THEN m.suma ELSE 0 END) - SUM(CASE WHEN m.tipModificare = 'DIMINUARE' THEN m.suma ELSE 0 END) as totalsuma
        
      FROM Angajamente a
      LEFT JOIN ModificariAngajamente m ON a.id = m.idAngajament
      LEFT JOIN Categorii cat on cat.id = a.idCategorie
      WHERE a.data >= ${new Date(from)}
        AND a.data < ${todate}
        ${query.compartiment ? Prisma.sql`AND a.idCompartiment = ${Number(query.compartiment)}` : Prisma.sql`AND a.idCompartiment > 0`}
        ${query.sursa ? Prisma.sql`AND cat.idsursa = ${Number(query.sursa)}` : Prisma.sql`AND cat.idsursa > 0`}
        ${query.artbug ? Prisma.sql`AND cat.idarticol = ${Number(query.artbug)}` : Prisma.sql`AND cat.idarticol > 0`}
          ${query.sumaoperator ? Prisma.sql`AND (
          SELECT 
            SUM(CASE WHEN m2.tipModificare = 'MAJORARE' THEN m2.suma ELSE 0 END) -
            SUM(CASE WHEN m2.tipModificare = 'DIMINUARE' THEN m2.suma ELSE 0 END)
          FROM ModificariAngajamente m2
          WHERE m2.idAngajament = a.id
        ) ${operatorSql} ${Number(query.sumavalue)}` : Prisma.sql``}
      GROUP BY a.id
      ${query.viza === 'true' ? Prisma.sql`HAVING COUNT(m.id) > 0 AND COUNT(m.id) = COUNT(CASE WHEN m.vizaCFPP = true THEN 1 END)` : 
       query.viza === 'false' ? Prisma.sql`HAVING COUNT(m.id) > COUNT(CASE WHEN m.vizaCFPP = true THEN 1 END)` : 
       Prisma.sql``}
      ORDER BY a.created_at DESC
    `
   //console.log(query)
    // Fetch related data in a separate efficient query
    const angajamenteWithRelations = await prisma.angajamente.findMany({
      where: {
        id: {
          in: (angajamenteWithCounts as any[]).map(a => a.id)
        }
      },
      include: {
        categorie: {
          include: {
            sursaFinantare: true,
            articolBugetar: true
          }
        },
        compartiment: true,
        modificari: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    })

    // Merge the raw counts with the relations
    return angajamenteWithRelations.map(angajament => {
      const counts = (angajamenteWithCounts as any[]).find(a => a.id === angajament.id)
      return {
        ...angajament,
        vizatCFPP: counts.totalModificari > 0 && counts.totalModificari === counts.totalVizate,
        totalModificari: Number(counts.totalModificari),
        totalVizate: Number(counts.totalVizate),
        totalsuma:formatAmount(Number(counts.totalsuma))
      }
    })
  }

  if (event.method === 'POST') {
    const body = await readBody<CreateAngajamentDTO>(event)
    
    // Generate unique number for angajament
    const count = await prisma.angajamente.count({
      where: { exercitiuBugetar: body.exercitiuBugetar }
    })
    const numar = `A${body.exercitiuBugetar}-${(count + 1).toString().padStart(4, '0')}`

    // Get validation data for initial modification
    const validationResult = await $fetch('/api/angajamente/validate', {
      method: 'POST',
      body: {
        idCategorie: body.idCategorie,
        suma: body.suma
      }
    })

    if (!validationResult.valid) {
      throw createError({
        statusCode: 400,
        message: 'Fonduri insuficiente pentru suma specificată'
      })
    }

    // Create angajament and initial modification
    const result = await prisma.$transaction(async (tx) => {
      const angajament = await tx.angajamente.create({
        data: {
          numar,
          idCategorie: body.idCategorie,
          idCompartiment: body.idCompartiment,
          descriere: body.descriere,
          exercitiuBugetar: body.exercitiuBugetar
        },
        include: {
          categorie: {
            include: {
              sursaFinantare: true,
              articolBugetar: true
            }
          },
          compartiment: true
        }
      })

      // Create initial modification
      await tx.modificariAngajamente.create({
        data: {
          idAngajament: angajament.id,
          tipModificare: 'MAJORARE',
          suma: body.suma,
          motiv: 'Creare angajament',
          idUser: body.idUser, // Use idUser from DTO
          sumaBuget: validationResult.sumaBuget,
          disponibilBugetar: validationResult.disponibilBugetar
        }
      })

      return angajament
    })

    return result
  }
})
