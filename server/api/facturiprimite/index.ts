import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      // Extract optional query parameters for filtering
      const { 
        startDate, 
        endDate, 
        compartimentId, 
        furnizorId, 
        statusPlata 
      } = getQuery(event)
  
      // Build where clause for filtering
      const whereCondition: any = {}
  
      // Add date range filter if provided
      if (startDate && endDate) {
        whereCondition.dataFactura = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        }
      }
  
      // Add compartiment filter if provided
      if (compartimentId) {
        whereCondition.idCompartiment = Number(compartimentId)
      }
  
      // Add furnizor filter if provided
      if (furnizorId) {
        whereCondition.idFurnizor = Number(furnizorId)
      }
  
      // Add status plata filter if provided
      if (statusPlata) {
        whereCondition.statusPlata = statusPlata
      }
      whereCondition.statusPlata = 'NEPLATITA' || 'PARTIAL_PLATITA'
      // Retrieve facturi primite with all requested relations
      const facturiPrimite = await prisma.facturiPrimite.findMany({
        where: whereCondition,
        include: {
          furnizor: {
            select: {
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
          }
        },
        orderBy: {
         furnizor:{
          denumire: 'asc'
         }
        }
      })
  
      return facturiPrimite
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
