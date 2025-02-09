import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {


    const idAngajament = Number(event.context.params?.id)

    const body = await readBody(event)

    // Start a transaction to ensure both updates succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update the Angajament
      const updatedAngajament = await tx.angajamente.update({
        where: { id: idAngajament },
        data: {
          descriere: body.descriere,
          idCategorie: body.idCategorie,
          data: new Date(body.dataang),
          updated_at: new Date()
        }
      })

      // Update the ModificariAngajamente
      const updatedModificare = await tx.modificariAngajamente.update({
        where: { id: body.idModificare },
        data: {
          suma: body.suma,
          created_at: new Date(body.dataang)
          
        }
      })

      return {
        angajament: updatedAngajament,
        modificare: updatedModificare
      }
    })

    return result
  } catch (error) {
    console.error('Error updating angajament:', error)
    throw createError({
      statusCode: 500,
      message: 'Error updating angajament'
    })
  }
})