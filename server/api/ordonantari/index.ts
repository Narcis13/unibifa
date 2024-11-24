import { PrismaClient ,Prisma} from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {

   
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
})
