// server/api/angajamente/[id]/totalreceptii.get.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid angajament ID'
      })
    }

    const result = await prisma.receptii.aggregate({
      where: {
        idAngajament: id,
        stare: 'activ' // Only count active receptii
      },
      _sum: {
        valoare: true
      }
    })

    return {
      success: true,
      total: result._sum.valoare || 0
    }

  } catch (error) {
    console.error('Error calculating total receptii:', error)
    throw createError({
      statusCode: 500,
      message: 'Error calculating total receptii'
    })
  }
})