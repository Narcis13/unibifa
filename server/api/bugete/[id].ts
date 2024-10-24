// server/api/bugete/[id].ts
import { PrismaClient } from '@prisma/client'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method
  const id = parseInt(event.context.params?.id as string)

  // Validate ID
  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid ID format'
    })
  }

  try {
    switch (method) {
      case 'GET':
        return await getBuget(id)
      case 'PUT':
        return await updateBuget(event, id)
      case 'DELETE':
        return await deleteBuget(id)
      default:
        throw createError({
          statusCode: 405,
          message: 'Method not allowed'
        })
    }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        message: 'Budget not found'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})

// Get single budget
async function getBuget(id: number) {
  return await prisma.bugete.findUniqueOrThrow({
    where: { id },
    include: {
      sursaFinantare: true,
      articolBugetar: true
    }
  })
}

// Update budget
async function updateBuget(event: H3Event, id: number) {
  const body = await readBody(event)

  // Validate request body
  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body'
    })
  }

  // Validate numeric fields
  const numericFields = ['trimI', 'trimII', 'trimIII', 'trimIV', 'total']
  for (const field of numericFields) {
    const value = parseFloat(body[field])
    if (isNaN(value) || value < 0) {
      throw createError({
        statusCode: 400,
        message: `Invalid value for ${field}. Must be a positive number.`
      })
    }
  }

  // Update budget
  return await prisma.bugete.update({
    where: { id },
    data: {
      trimI: body.trimI,
      trimII: body.trimII,
      trimIII: body.trimIII,
      trimIV: body.trimIV,
      total: body.total,
    },
    include: {
      sursaFinantare: true,
      articolBugetar: true
    }
  })
}

// Delete budget
async function deleteBuget(id: number) {
  return await prisma.bugete.delete({
    where: { id }
  })
}