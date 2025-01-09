// server/api/generate-plati-xml.post.ts

import { PrismaClient } from '@prisma/client'
import { format } from 'date-fns'
import { create } from 'xmlbuilder2'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Get date from request body
    const body = await readBody(event)
   
    const filterDate = new Date(body.date || new Date())
    console.log('Request body:', body,filterDate)
    // Get all payments for the specified date
    const payments = await prisma.plati.findMany({
      where: {
        dataop: {
         // gte: filterDate,
         // lt: new Date(filterDate.getTime() + 24 * 60 * 60 * 1000) 
         equals: filterDate
        },
        stare: 'activ'
      },
      orderBy: {
        numarop: 'asc'
      }
    })

    if (!payments.length) {
      throw new Error('No payments found for the specified date')
    }

    // Create XML structure
    const xml = create({ version: '1.0' })
      .ele('f1129', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'mfp:anaf:dgti:f1129:declaratie:v1',
        'xmlns': 'mfp:anaf:dgti:f1129:declaratie:v1',
        'versiune_pdf': 'A2.0.19',
        'd_rec': '0',
        'suma_control': '0',
        'total_opm': '0',
        'nr_inregistrari': payments.length,
        'luna_r': format(filterDate, 'M'),
        'an': format(filterDate, 'yyyy'),
        'data_document': format(filterDate, 'dd.MM.yyyy'),
        'nr_document': '0000000001',
        'nume_ip': 'UNITATEA MILITARA 02497',
        'adresa_ip': 'Str NEGRU VODA Nr 47',
        'cui_ip': '4318016',
        'tip_ent': '1'
      })

    // Add payment orders
    payments.forEach(payment => {
      xml.ele('rand_op', {
        'nr_op': payment.numarop,
        'iban_platitor': payment.ibanplatitor || '',
        'den_trezorerie': 'TREZORERIA  STATULUI',
        'cod_program': '0000001905',
        'cod_angajament': payment.codangajament || '',
        'ind_angajament': payment.indicator || '',
        'cui_beneficiar': payment.codfiscalfurnizor,
        'den_beneficiar': payment.numefurnizor,
        'iban_beneficiar': payment.ibanbeneficiar,
        'den_banca_trez': 'TREZORERIA  STATULUI',
        'suma_op': payment.suma.toFixed(2),
        'explicatii': payment.explicatii || ''
      }).up()
    })

    // Convert to string with pretty formatting
    const xmlString = xml.end({ prettyPrint: true })

    // Set response headers for XML file download
    setResponseHeaders(event, {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="Plati-${format(filterDate, 'yyyy-MM-dd')}.xml"`, // Added quotes around filename
      'Content-Length': Buffer.from(xmlString).length.toString()
    })

    // Return XML string
    return xmlString

  } catch (error) {
    console.error('Error generating XML:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error'
    })
  }
})

/*

filterDate variable is 2025-01-07T00:00:00.000Z in api endpoint and i have records in Plati table with dataop value 2025-01-07 08:41:45.786 and the prisma query return an empty array. Why?*/ 