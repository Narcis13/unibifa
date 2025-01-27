import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {

    try {
      const query = getQuery(event)
     
 
  const fromDate = query.from ? new Date(query.from.toString()) : null
  const toDate = query.to ? new Date(query.to.toString()) : null
  const ordonantareFilter = query.ordonantare?.toString()
  const sumaOperator = query.sumaoperator?.toString()
  const sumaValue = query.sumavalue ? parseFloat(query.sumavalue.toString()) : null
  const furnizorId = query.furnizor ? parseInt(query.furnizor.toString()) : null
  const sursaId = query.sursa ? parseInt(query.sursa.toString()) : null
  const articolBugetarId = query.artbug ? parseInt(query.artbug.toString()) : null
      const compartimentId = query.compartimentId
  
      if (!compartimentId) {
        throw createError({
          statusCode: 400,
          message: 'Compartiment ID is required'
        })
      }
      const whereClause: any = {
        idCompartiment: parseInt(compartimentId.toString())
      }
    
      // Add date range filter if both from and to dates are provided
      if (fromDate && toDate) {
        whereClause.datafact = {
          gte: fromDate,
          lte: toDate
        }
      } else if (fromDate) {
        whereClause.datafact = { gte: fromDate }
      } else if (toDate) {
        whereClause.datafact = { lte: toDate }
      }
    
      // Add suma (value) filter
      if (sumaValue !== null && sumaOperator) {
        switch (sumaOperator) {
          case 'gt':
            whereClause.valoare = { gt: sumaValue }
            break
          case 'gte':
            whereClause.valoare = { gte: sumaValue }
            break
          case 'lt':
            whereClause.valoare = { lt: sumaValue }
            break
          case 'lte':
            whereClause.valoare = { lte: sumaValue }
            break
          case 'eq':
            whereClause.valoare = sumaValue
            break
          default:
            throw createError({
              statusCode: 400,
              message: 'Invalid suma operator'
            })
        }
      }
      // Get the start of the current year
      const startOfYear = new Date(new Date().getFullYear(), 0, 1)
      whereClause.created_at={
        gte: startOfYear
      }

      let ordonantareWhere = undefined
      if (ordonantareFilter === 'true') {
        // Only receptions with payment orders
        ordonantareWhere = {
          some: {} // This ensures at least one payment order exists
        }
      } else if (ordonantareFilter === 'false') {
        // Only receptions without payment orders
        ordonantareWhere = {
          none: {} // This ensures no payment orders exist
        }
      }

      if (furnizorId) {
        whereClause.idFurnizor = furnizorId
      }
    
      const receptions = await prisma.receptii.findMany({
        where: {
          ...whereClause,
          // Sursa and articol bugetar filters
          angajament: {
            categorie: {
              ...(sursaId ? { idsursa: sursaId } : {}),
              ...(articolBugetarId ? { idarticol: articolBugetarId } : {})
            }
          },
          // Ordonantare filter
          ordonantari: 
            ordonantareFilter === 'true' 
              ? { some: {} } 
              : ordonantareFilter === 'false' 
              ? { none: {} } 
              : undefined
        },
        include: {
          angajament: {
            include: {
              categorie: {
                include: {
                  sursaFinantare: true,
                  articolBugetar: true
                }
              }
            }
          },
          furnizor: {
            select: {
              id: true,
              denumire: true,
              codfiscal: true
            }
          },
          compartiment: {
            select: {
              denumire: true
            }
          },
          ordonantari: {
            take: 1,
            include: {
              ordonantare: {
                select: {
                  numar: true,
                  dataord: true,
                  stare: true,
                  valoare: true
                }
              }
            }
          }
        },
        orderBy: [
          {
            angajament: {
              categorie: {
                sursaFinantare: {
                  scurt: 'asc'
                }
              }
            }
          },
          {
            angajament: {
              categorie: {
                articolBugetar: {
                  cod: 'asc'
                }
              }
            }
          },
          {
            furnizor: {
              denumire: 'asc'
            }
          },
          {
            datafact: 'desc'
          }
        ]
      })
  
      // Transform the data to include calculated fields or modify structure if needed
      const formattedReceptions = receptions.map(reception => ({
        id: reception.id,
        nrfact: reception.nrfact,
        datafact: reception.datafact,
        valoare: reception.valoare,
        mentiuni: reception.mentiuni,
        stare: reception.stare,
        created_at: reception.created_at,
        furnizor: reception.furnizor,
        compartiment: reception.compartiment.denumire,
        sursafinantare:reception.angajament.categorie.sursaFinantare.scurt,
        articolbugetar:reception.angajament.categorie.articolBugetar.cod,
        angajament: {
          id: reception.angajament.id,
          numar: reception.angajament.numar,
          descriere: reception.angajament.descriere,
          exercitiuBugetar: reception.angajament.exercitiuBugetar,
          categorie: {
            denumire: reception.angajament.categorie.denumire,
            sursaFinantare: {
              denumire: reception.angajament.categorie.sursaFinantare.denumire,
              cod: reception.angajament.categorie.sursaFinantare.cod
            },
            articolBugetar: {
              denumire: reception.angajament.categorie.articolBugetar.denumire,
              cod: reception.angajament.categorie.articolBugetar.cod
            }
          }
        },
        ordonantare: reception.ordonantari[0] ? {
          numar: reception.ordonantari[0].ordonantare.numar,
          data: reception.ordonantari[0].ordonantare.dataord,
          stare: reception.ordonantari[0].ordonantare.stare,
          valoare: reception.ordonantari[0].ordonantare.valoare
        } : null
      }))
  
      return  formattedReceptions
     
  
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Internal server error'
      })
    }
  }

  if (event.method === 'POST') {
    try {
        // Parse request body
        const body = await readBody(event)
    
        // Validate input manually
        if (!body.idAngajament || !body.idFurnizor || !body.datafact || 
            !body.valoare || !body.idCompartiment) {
          throw createError({
            statusCode: 400,
            message: 'Missing required fields'
          })
        }
       // console.log('receptie.datfact',body.datafact)
        // Create new Receptie
        const newReceptie = await prisma.receptii.create({
          data: {
            idAngajament: Number(body.idAngajament),
            idFurnizor: Number(body.idFurnizor),
            nrfact:body.nrfact,
            datafact: new Date(body.datafact.replace(/\//g, '-')),
            valoare: Number(body.valoare),
            mentiuni: body.mentiuni,
            idCompartiment: Number(body.idCompartiment),
            stare: 'activ'
          }
        })
    
        return newReceptie
      } catch (error) {
        return createError({
          statusCode: 500,
          message: 'Error creating Receptie',
          data: error
        })
      }
  }
})
