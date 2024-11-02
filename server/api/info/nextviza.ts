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

  if(event.method==='PATCH'){
    const body= await readBody(event)
    //console.log(body)

    await prisma.modificariAngajamente.update({
      where: {
        id:body.idModificareAngajament
      },
      data: {
        vizaCFPP:true, // Field to update for all matched records
        nr_viza:body.nrvizac,
        dataCFPP:body.dataviza,
        codang:body.codang,
        indicator:body.indicator
      },
    });
  }
})