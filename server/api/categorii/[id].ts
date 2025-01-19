import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get the ID from the URL parameter
    const id = parseInt(event.context.params?.id as string)
    
    // Get the request body
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.denumire || !body.explicatii || !body.idsursa || !body.idarticol || !body.idcompartiment) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Check if the category exists
    const existingCategorie = await prisma.categorii.findUnique({
      where: { id }
    })

    if (!existingCategorie) {
      throw createError({
        statusCode: 404,
        message: 'Category not found'
      })
    }

    // Validate foreign key relationships
    const [sursaExists, articolExists, compartimentExists] = await Promise.all([
      prisma.sursefinantare.findUnique({ where: { id: body.idsursa } }),
      prisma.articolebugetare.findUnique({ where: { id: body.idarticol } }),
      prisma.compartimente.findUnique({ where: { id: body.idcompartiment } })
    ])

    if (!sursaExists || !articolExists || !compartimentExists) {
      throw createError({
        statusCode: 400,
        message: 'Invalid foreign key reference'
      })
    }

    // Update the category
    const updatedCategorie = await prisma.categorii.update({
      where: { id },
      data: {
        denumire: body.denumire,
        explicatii: body.explicatii,
        idsursa: body.idsursa,
        idarticol: body.idarticol,
        idcompartiment: body.idcompartiment,
        stare: body.stare || 'activ',  // Default to 'activ' if not provided
        updated_at: new Date()
      },
      include: {
        sursaFinantare: {
          select: {
            denumire: true
          }
        },
        articolBugetar: {
          select: {
            denumire: true,
            cod: true
          }
        },
        compartiment: {
          select: {
            denumire: true
          }
        }
      }
    })

    // Return the updated category with related data
    return updatedCategorie

  } catch (error) {
    // Log the error for debugging (you might want to use a proper logging solution)
    console.error('Error updating category:', error)

    // If it's already a H3Error, rethrow it
    if (error.statusCode) {
      throw error
    }

    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        message: 'A category with this name already exists'
      })
    }

    // Generic error handler
    throw createError({
      statusCode: 500,
      message: 'An error occurred while updating the category'
    })
  } finally {
    await prisma.$disconnect()
  }
})