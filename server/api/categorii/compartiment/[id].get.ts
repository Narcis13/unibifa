import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const compartimentId = Number(event.context.params?.id)
  
  if (!compartimentId) {
    throw createError({
      statusCode: 400,
      message: 'ID compartiment invalid'
    })
  }

  const categorii = await prisma.categorii.findMany({
    where: {
      idcompartiment: compartimentId,
      stare: 'activ'
    },
    include: {
      sursaFinantare: true,
      articolBugetar: true
    },
    orderBy: {
      denumire: 'asc'
    }
  })

  // Format pentru q-select options
  return categorii.map(cat => ({
    label: `${cat.denumire} (${cat.sursaFinantare.cod} - ${cat.articolBugetar.cod})`,
    value: cat.id,
    // Include informații adiționale care ar putea fi utile
    categorie: {
      id: cat.id,
      denumire: cat.denumire,
      sursaFinantare: {
        id: cat.sursaFinantare.id,
        denumire: cat.sursaFinantare.denumire,
        cod: cat.sursaFinantare.cod
      },
      articolBugetar: {
        id: cat.articolBugetar.id,
        denumire: cat.articolBugetar.denumire,
        cod: cat.articolBugetar.cod
      }
    }
  }))
})
