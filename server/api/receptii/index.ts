import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {

    try {
      const query = getQuery(event)
      const compartimentId = query.compartimentId
  
      if (!compartimentId) {
        throw createError({
          statusCode: 400,
          message: 'Compartiment ID is required'
        })
      }
  
      // Get the start of the current year
      const startOfYear = new Date(new Date().getFullYear(), 0, 1)
  
      const receptions = await prisma.receptii.findMany({
        where: {
          idCompartiment: parseInt(compartimentId.toString()),
          created_at: {
            gte: startOfYear
          }
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
              id:true,
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
            take: 1, // Since we know there can only be one
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
    
        // Create new Receptie
        const newReceptie = await prisma.receptii.create({
          data: {
            idAngajament: Number(body.idAngajament),
            idFurnizor: Number(body.idFurnizor),
            nrfact:body.nrfact,
            datafact: new Date(body.datafact),
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
