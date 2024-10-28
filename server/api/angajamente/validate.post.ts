import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { idCategorie, suma } = body

  const categorie = await prisma.categorii.findUnique({
    where: { id: idCategorie },
    include: {
      sursaFinantare: true,
      articolBugetar: true
    }
  })

  if (!categorie) {
    throw createError({
      statusCode: 404,
      message: 'Categorie not found'
    })
  }

  // Get current budget amount
  const buget = await prisma.bugete.findUnique({
    where: {
      idSursa_idArticol: {
        idSursa: categorie.idsursa,
        idArticol: categorie.idarticol
      }
    }
  })

  const sumaBuget = buget?.total || 0

  // Calculate current committed amount
  const angajamente = await prisma.angajamente.findMany({
    where: {
      idCategorie,
      exercitiuBugetar: new Date().getFullYear()
    },
    include: {
      modificari: true
    }
  })

  const sumaAngajata = angajamente.reduce((total, ang) => {
    const sumaModificari = ang.modificari.reduce((sum, mod) => {
      return sum + (mod.tipModificare === 'MAJORARE' ? Number(mod.suma) : -Number(mod.suma))
    }, 0)
    return total + sumaModificari
  }, 0)

  const disponibil = Number(sumaBuget) - sumaAngajata

  return {
    valid: disponibil >= suma,
    disponibil,
    sumaBuget,
    sumaAngajata
  }
})
