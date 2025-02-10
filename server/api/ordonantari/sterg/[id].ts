import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const id = parseInt(event.context.params?.id as string)

    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid ID provided'
      })
    }

    // First, delete all related records in ReceptiiOrdonantari
    await prisma.receptiiOrdonantari.deleteMany({
      where: {
        idOrdonantare: id
      }
    })

    // Then delete the OrdonantariPlata record
    const deletedOrdonantare = await prisma.ordonantariPlata.delete({
      where: {
        id: id
      }
    })

    return {
      success: true,
      data: deletedOrdonantare
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Could not delete ordonantare'
    })
  } finally {
    await prisma.$disconnect()
  }
})