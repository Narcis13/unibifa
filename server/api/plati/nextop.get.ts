import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const currentYear = new Date().getFullYear()
  
  const count = await prisma.plati.count({
    where: {
      anfiscal: currentYear
    }
  })

  return { nextop: count + 1 }
})