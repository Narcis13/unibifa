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
  const relatedCategories = await prisma.categorii.findMany({
    where: {
      idsursa: categorie.idsursa,
      idarticol: categorie.idarticol
    },
    select: {
      id: true
    }
  });
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
      idCategorie:{
        in: relatedCategories.map(cat => cat.id)
      },
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

  const disponibilBugetar = Number(sumaBuget) - sumaAngajata

  return {
    valid: disponibilBugetar >= suma,
    disponibilBugetar,
    sumaBuget,
    sumaAngajata
  }
})
