import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      // Extract optional query parameters for filtering
     // console.log('try to get facturi primite')
      const { 
        dela, 
        panala, 
        platitedela,
        platitepanala,
        sortby,
        platite,
        artbug,
        sursafin,
        furnizorId, 
        statusPlata 
      } = getQuery(event)
     // console.log('sortby', sortby)
      // Build where clause for filtering

      let orderByCondition;
      if (sortby === 'articolbugetar') {
        orderByCondition = [
          {
            articolBugetar: {
              cod: 'asc'
            }
          },
          {
            furnizor: {
              denumire: 'asc'
            }
          }
        ];
      } else {
        orderByCondition = [
          {
            furnizor: {
              denumire: 'asc'
            }
          }
        ];
      }
     // console.log('platite',typeof  platite)

      let whereCondition: any = {
       
      }
      /*statusPlata: {
        in: ['NEPLATITA', 'PARTIAL_PLATITA']
      }*/

        if(platite!=='toate'){  
          whereCondition.statusPlata= {
            in: platite==='false'?['NEPLATITA', 'PARTIAL_PLATITA']:['PLATITA', 'PARTIAL_PLATITA']
          }
          if(platite==='true'){
            const startDate = new Date(platitedela.replace(/\//g, '-')); // Convert 2025/01/25 to 2025-01-25
            const endDate = new Date(platitepanala.replace(/\//g, '-'));
            whereCondition.plati = {
              some: {
                plata: {
                  dataop: {
                    gte: startDate,
                    lte: endDate
                  }
              }
              }
            }
        }}
      // Add date range filter if provided
      if (dela && panala) {
        whereCondition.dataFactura = {
          gte: new Date(dela.replace(/\//g, '-')),
          lte: new Date(panala.replace(/\//g, '-'))
        }
      }
  
      // Add compartiment filter if provided

  
      // Add furnizor filter if provided
       if (furnizorId) {
         whereCondition.idFurnizor = Number(furnizorId)
       }

      if (artbug) {
        whereCondition.articolBugetar = {
          id: Number(artbug)
        }
      }

      if (sursafin) {
        whereCondition.sursaFinantare = {
          id: Number(sursafin)
        }
      }
      // Add status plata filter if provided
      if (statusPlata) {
        whereCondition.statusPlata = statusPlata
      }
    // console.log('whereCondition',whereCondition)
      // Retrieve facturi primite with all requested relations
      const facturiPrimite = await prisma.facturiPrimite.findMany({
        where: whereCondition,
        include: {
          furnizor: {
            select: {
              id: true,
              denumire: true,
              codfiscal: true,
              iban: true
            }
          },
          articolBugetar: true,
          sursaFinantare: true,
          compartiment: {
            select: {
              denumire: true
            }
          },
          receptie: {
            include: {
              angajament: {
                include: {
                  modificari: {
                    include: {
                      user: {
                        select: {
                          name: true
                        }
                      }
                    },
                    orderBy: {
                      created_at: 'desc'
                    }
                  }
                }
              }
            }
          },
          plati: {
            include: {
              plata: true
            }
          }
        },
        orderBy: orderByCondition
      })
  
      // Calculate ramasplata for each factura
      const facturiWithRamasPlata = facturiPrimite.map(factura => {
        // Calculate total paid amount
        const totalPlatit = factura.plati.reduce((sum, plataEntry) => {
          return sum + Number(plataEntry.sumaAchitata)
        }, 0)
  
        // Calculate remaining amount
        const ramasplata = Number(factura.valoare) - totalPlatit
  
        // Return factura with calculated ramasplata
        return {
          ...factura,
          ramasplata: Number(ramasplata.toFixed(2)), // Round to 2 decimal places
          totalPlatit: Number(totalPlatit.toFixed(2))
        }
      })
  
      return facturiWithRamasPlata
    } catch (error) {
      console.error('Error retrieving facturi primite:', error)
      
      // Handle different types of errors
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: error.message
        })
      }
  
      throw createError({
        statusCode: 500,
        statusMessage: 'Unknown Error',
        message: 'An unexpected error occurred'
      })
    }
  }

  if (event.method === 'POST') {
    try {
        // Parse the incoming request body
        const body = await readBody(event)
    
        // Validate required fields
        if (!body.idFurnizor || !body.numarFactura || !body.dataFactura || !body.valoare) {
          throw createError({
            statusCode: 400,
            message: 'Missing required fields: idFurnizor, numarFactura, dataFactura, valoare'
          })
        }
    
        // Prepare the data object for creation
        const facturaData = {
          idFurnizor: body.idFurnizor,
          numarFactura: body.numarFactura,
          dataFactura: new Date(body.dataFactura),
          valoare: body.valoare,
          
          // Optional fields
          detaliiFactura: body.detaliiFactura || undefined,
          idArticolBugetar: body.idArticolBugetar || undefined,
          idSursaFinantare: body.idSursaFinantare || undefined,
          idOrdonantare: body.idOrdonantare || undefined,
          idReceptie: body.idReceptie || undefined,
          idCompartiment: body.idCompartiment || undefined,
          
          // Additional optional fields
          tipDocument: body.tipDocument || 'FACTURA',
          termenPlata: body.termenPlata ? new Date(body.termenPlata) : undefined,
          statusPlata: body.statusPlata || 'NEPLATITA',
          
          // Stare will default to 'activ' as defined in the schema
          stare: body.stare || 'activ'
        }
    
        // Create the FacturiPrimite record
        const facturaCreata = await prisma.facturiPrimite.create({
          data: facturaData,
          // Optionally include related data in the response
          include: {
            furnizor: true,
            articolBugetar: true,
            sursaFinantare: true,
            ordonantare: true,
            receptie: true,
            compartiment: true
          }
        })
    
        // Return the created record
        return {
          statusCode: 201,
          body: facturaCreata
        }
      } catch (error) {
        // Handle different types of errors
        if (error instanceof Error) {
          throw createError({
            statusCode: 500,
            message: `Eroare la crearea facturii: ${error.message}`
          })
        }
    
        // Fallback error handling
        throw createError({
          statusCode: 500,
          message: 'Eroare necunoscută la crearea facturii'
        })
      }
  }
})
