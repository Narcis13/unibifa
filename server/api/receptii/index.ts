import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
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
