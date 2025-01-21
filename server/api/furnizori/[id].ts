import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the ID from the URL parameter
    const id = parseInt(event.context.params?.id as string)
    
    // Get the request body
    const body = await readBody(event)
    


    // Check if the category exists
    const existingCategorie = await prisma.furnizori.findUnique({
      where: { id }
    })

    if (!existingCategorie) {
      throw createError({
        statusCode: 404,
        message: 'Furnizor de negasit '
      })
    }


    // Update the category
    const updatedCategorie = await prisma.furnizori.update({
      where: { id },
      data: {
        denumire: body.denumire,
        codfiscal: body.codfiscal,
        iban: body.iban,

        updated_at: new Date()
      }
        })

    // Return the updated category with related data
    return updatedCategorie

  } catch (error) {
    // Log the error for debugging (you might want to use a proper logging solution)
    console.error('Error updating category:', error)

    // If it's already a H3Error, rethrow it
   
  } finally {
    await prisma.$disconnect()
  }
})