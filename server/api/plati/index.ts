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
          id: 'desc'
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
    //console.log('body',body)
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Create payment record
        const plata = await tx.plati.create({
          data: {
            numarop: body.numarOP,
            anfiscal: new Date().getFullYear(),
            dataop: new Date(body.dataOP.replace(/\//g, '-')),
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
        // console.log('plata partiala',totalPlatit._sum.sumaAchitata,'>=',factura.ramasplata)
          // Update invoice status
          await tx.facturiPrimite.update({
            where: { id: factura.id },
            data: {
              statusPlata: totalPlatit._sum.sumaAchitata! >= factura.ramasplata 
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

  if (event.method === 'PATCH') {
    try {
      // Get payment ID from request body
      const { idPlata } = await readBody(event)
  
      if (!idPlata) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Payment ID is required'
        })
      }
  
      // Use a transaction to ensure all updates are performed atomically
      const result = await prisma.$transaction(async (tx) => {
        // 1. Get all affected invoice IDs first
        const affectedPaymentLinks = await tx.facturiPlati.findMany({
          where: {
            idPlata: idPlata
          },
          select: {
            idFactura: true
          }
        })
  
        const affectedInvoiceIds = affectedPaymentLinks.map(link => link.idFactura)
  
        // 2. Update the payment status to 'anulat'
        await tx.plati.update({
          where: {
            id: idPlata
          },
          data: {
            stare: 'anulat'
          }
        })
  
        // 3. Set sumaAchitata to 0 for all related FacturiPlati entries
        await tx.facturiPlati.deleteMany({
          where: {
            idPlata: idPlata
          }/*,
          data: {
            sumaAchitata: 0
          }*/
        })
  
        // 4. For each affected invoice, we need to:
        // a) Calculate total remaining payments from other active payments
        // b) Update status based on remaining payment amount
        for (const invoiceId of affectedInvoiceIds) {
          // Get invoice total amount and sum of other active payments
          const invoice = await tx.facturiPrimite.findUnique({
            where: { id: invoiceId },
            include: {
              plati: {
                include: {
                  plata: true
                }
              }
            }
          })
  
          if (invoice) {
            // Calculate total of remaining active payments
            const totalPaid = invoice.plati.reduce((sum, payment) => {
              if (payment.plata.stare === 'activ') {
                return sum + Number(payment.sumaAchitata)
              }
              return sum
            }, 0)
  
            // Determine new payment status
            let newStatus = 'NEPLATITA'
           /* if (totalPaid >= Number(invoice.valoare)) {
              newStatus = 'PLATITA'
            } else if (totalPaid > 0) {
              newStatus = 'PARTIAL_PLATITA'
            }*/
  
            // Update invoice status
            await tx.facturiPrimite.update({
              where: { id: invoiceId },
              data: {
                statusPlata: newStatus
              }
            })
          }
        }
  
        return {
          success: true,
          affectedInvoices: affectedInvoiceIds.length
        }
      })
  
      return {
        success: true,
        message: 'Payment cancelled successfully',
        affectedInvoices: result.affectedInvoices
      }
  
    } catch (error) {
      console.error('Error cancelling payment:', error)
      
      if (error instanceof Error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: error.message
        })
      }
  
      throw createError({
        statusCode: 500,
        statusMessage: 'Unknown Error',
        message: 'An unexpected error occurred'
      })
    }
  }
})
