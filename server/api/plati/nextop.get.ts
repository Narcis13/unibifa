import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const currentYear = new Date().getFullYear()
  
  const lastPayment = await prisma.plati.findFirst({
    where: {
      anfiscal: currentYear
    },
    orderBy: {
      numarop: 'desc'
    },
    select: {
      numarop: true
    }
  })

  return { nextop: (lastPayment?.numarop || 0) + 1 }
})