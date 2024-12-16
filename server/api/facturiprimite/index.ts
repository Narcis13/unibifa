import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {


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
