import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Type for the angajament with computed vizatCFPP field


export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    try {
      const currentYear = new Date().getFullYear()
      
      const plati = await prisma.plati.findMany({
        where: {
          anfiscal: currentYear//,
         // stare: 'activ'
        },
        orderBy: {
          dataop: 'desc'
        },
        select: {
          id: true,
          numarop: true,
          dataop: true,
          numefurnizor: true,
          suma: true,
          explicatii: true,
          artbug: true,
          stare: true
        }
      })
  
      return plati
  
    } catch (error) {
      console.error('Error fetching plati:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching payment data'
      })
    }

  }

  if (event.method === 'POST') {
    const body = await readBody(event)
  
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Create payment record
        const plata = await tx.plati.create({
          data: {
            numarop: body.numarOP,
            anfiscal: new Date().getFullYear(),
            dataop: new Date(body.dataOP),
            numefurnizor: body.facturi[0].numefurnizor,
            ibanplatitor: body.facturi[0].ibanplatitor,
            ibanbeneficiar: body.facturi[0].ibanfurnizor,
            explicatii: body.detalii,
            suma: body.valoarePlata,
            codangajament: body.codAngajament,
            indicator: body.indicator,
            artbug: body.artBug,
            codfiscalfurnizor: body.facturi[0].codfiscalfurnizor,
          }
        })
  
        // 2. Create records in junction table and update invoice status
        for (const factura of body.facturi) {
          await tx.facturiPlati.create({
            data: {
              idFactura: factura.id,
              idPlata: plata.id,
              sumaAchitata: body.facturi.length === 1 ? body.valoarePlata : factura.ramasplata
            }
          })
  
          // Calculate total paid amount for this invoice
          const totalPlatit = await tx.facturiPlati.aggregate({
            where: { idFactura: factura.id },
            _sum: { sumaAchitata: true }
          })
  
          // Update invoice status
          await tx.facturiPrimite.update({
            where: { id: factura.id },
            data: {
              statusPlata: totalPlatit._sum.sumaAchitata! >= factura.valoare 
                ? 'PLATITA' 
                : 'PARTIAL_PLATITA'
            }
          })
        }
  
        return { success: true, plataId: plata.id }
      })
  
    } catch (error) {
      console.error('Error saving payment:', error)
      throw createError({
        statusCode: 500,
        message: 'Error saving payment'
      })
    }
  }
})
