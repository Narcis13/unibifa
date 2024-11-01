import { PrismaClient } from '@prisma/client'
import type { CreateVizaCFPPDTO } from "~/types/vizecfpp"
//import type { CreateAngajamentDTO } from '~/types/angajamente'
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const count = await prisma.regviza.count()
    const numar = `${(count + 1).toString().padStart(5, '0')}`
    return { numar }
  }

  if (event.method === 'POST') {
    const body = await readBody<CreateVizaCFPPDTO>(event)
    //console.log(body)
    const viza = await prisma.regviza.create({
      data:{
        userid:body.userid,
        nume:body.nume,
        nrviza:parseInt(body.nrviza),
        nrvizac:body.nrvizac,
        dataviza:body.dataviza,
        document:body.document,
        explicatii:body.explicatii,
        compartiment:body.compartiment,
        valoare:parseFloat(body.valoare),
        stare:'activ'


      }
    })

    return {viza}
  }
})