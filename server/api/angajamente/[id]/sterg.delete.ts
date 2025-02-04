import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)
    if (!id) {
      throw new Error('Invalid angajament ID')
    }

    // Delete ModificariAngajamente first
    await prisma.modificariAngajamente.deleteMany({
      where: {
        idAngajament: id
      }
    })

    // Then delete the Angajament
    await prisma.angajamente.delete({
      where: {
        id: id
      }
    })

    return { success: true, id }

  } catch (error) {
    console.error('Error deleting angajament:', error)
    throw createError({
      statusCode: 500,
      message: 'Error deleting angajament'
    })
  }
})