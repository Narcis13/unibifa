import { PrismaClient } from '@prisma/client'
//import type { CreateAngajamentDTO } from '~/types/angajamente'
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const count = await prisma.regviza.count()
    const numar = `${(count + 1).toString().padStart(5, '0')}`
    return { numar }
  }

  if (event.method === 'POST') {
    
  }
})