import { PrismaClient } from '@prisma/client'
import type { ModificareAngajamentDTO } from '~/types/angajamente'
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody<ModificareAngajamentDTO>(event)

  const angajament = await prisma.angajamente.findUnique({
    where: { id },
    include: {
      categorie: true,
      modificari: true
    }
  })

  if (!angajament) {
    throw createError({
      statusCode: 404,
      message: 'Angajament not found'
    })
  }

  // Get current budget amount
  const buget = await prisma.bugete.findUnique({
    where: {
      idSursa_idArticol: {
        idSursa: angajament.categorie.idsursa,
        idArticol: angajament.categorie.idarticol
      }
    }
  })

  const sumaBuget = buget?.total || 0

  // Calculate current committed amount
  const angajamenteExistente = await prisma.angajamente.findMany({
    where: {
      idCategorie: angajament.idCategorie,
      exercitiuBugetar: angajament.exercitiuBugetar
    },
    include: {
      modificari: true
    }
  })

  const sumaAngajata = angajamenteExistente.reduce((total, ang) => {
    const sumaModificari = ang.modificari.reduce((sum, mod) => {
      return sum + (mod.tipModificare === 'MAJORARE' ? Number(mod.suma) : -Number(mod.suma))
    }, 0)
    return total + sumaModificari
  }, 0)

  const disponibilBugetar = Number(sumaBuget) - sumaAngajata

  // Create modification
  const modificare = await prisma.modificariAngajamente.create({
    data: {
      idAngajament: id,
      tipModificare: body.tipModificare,
      suma: body.suma,
      motiv: body.motiv,
      idUser: body.idUser, // Use idUser from DTO
      sumaBuget,
      disponibilBugetar
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  return modificare
})
