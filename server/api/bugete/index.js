import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const bugete = await prisma.bugete.findMany({
      include: {
        sursaFinantare: true,
        articolBugetar: true
      }
    })
    return bugete
  } catch (error) {
    console.error('Error fetching bugete:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching budget data'
    })
  }
})