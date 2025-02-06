//sterg receptie
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.idreceptie)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID provided'
      })
    }

    await prisma.receptii.delete({
      where: { id }
    })

    return { 
      success: true,
      id 
    }

  } catch (error) {
    console.error('Delete reception error:', error)
    throw createError({
      statusCode: 500,
      message: 'Error deleting reception'
    })
  }
})