// server/api/ordonantari/[idord]/xml.get.ts

import { PrismaClient } from '@prisma/client'
import { format } from 'date-fns'
import { create } from 'xmlbuilder2'
import { H3Event } from 'h3'

const prisma = new PrismaClient()

export default defineEventHandler(async (event: H3Event) => {
  try {
    const idord = getRouterParam(event, 'idord')

    if (!idord) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID ordonanțare lipsește'
      })
    }

    // Fetch the ordonantare with all related data
    const ordonantare = await prisma.ordonantariPlata.findUnique({
      where: { id: parseInt(idord) },
      include: {
        furnizor: true,
        receptii: {
          include: {
            receptie: {
              include: {
                angajament: {
                  include: {
                    categorie: {
                      include: {
                        sursaFinantare: true,
                        articolBugetar: true
                      }
                    },
                    modificari: {
                      where: { vizaCFPP: true },
                      orderBy: { created_at: 'desc' },
                      take: 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!ordonantare) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Ordonanțarea nu a fost găsită'
      })
    }

    // Fetch institution data
    const institutie = await prisma.institutie.findFirst()

    if (!institutie) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Datele instituției nu au fost găsite'
      })
    }

    // Get the first reception (primary reception for the ordonantare)
    const primareceptie = ordonantare.receptii[0]?.receptie
    if (!primareceptie) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ordonanțarea nu are recepții asociate'
      })
    }

    const angajament = primareceptie.angajament
    const categorie = angajament.categorie
    const modificareAngajament = angajament.modificari[0]
    const articolBugetar = categorie?.articolBugetar

    // Helper function to derive bank name from IBAN
    const getBancaFromIban = (iban: string | null): string => {
      if (!iban) return ''
      // Romanian treasury IBANs start with RO and contain TREZ
      if (iban.includes('TREZ')) {
        const trezCode = iban.substring(4, 8)
        // Map trezorerie codes to names
        if (trezCode === '7005' || trezCode === '700') {
          return 'TREZORERIA MUNICIPIULUI BUCURESTI'
        }
        return 'TREZORERIA STATULUI'
      }
      return 'TREZORERIA STATULUI'
    }

    // Build cod_SSI from articol bugetar IBAN + cod articol
    // Format: "01" (fix) + partea din IBAN după TREZ (fără primele 2 cifre) + cod articol bugetar
    // Exemplu: "01" + "F660601" + "200108" = "01F660601200108"
    const getCodSSI = (): string => {
      if (articolBugetar?.iban && articolBugetar?.cod) {
        const iban = articolBugetar.iban
        // Extract the part after "TREZ" from IBAN, skip first 2 digits
        const trezIndex = iban.indexOf('TREZ')
        let ibanPart = ''
        if (trezIndex !== -1) {
          // Get everything after "TREZ", skip first 2 chars (e.g., "23"), take next 7 chars
          ibanPart = iban.substring(trezIndex + 4 + 2, trezIndex + 4 + 2 + 7)
        }
        // Clean the extracted part
        ibanPart = ibanPart.replace(/[^0-9A-Za-z]/g, '')
        // Concatenate: "01" (fixed) + ibanPart + articol cod (remove dots if any)
        const codArticol = articolBugetar.cod.replace(/\./g, '')
        return '01' + ibanPart + codArticol
      }
      return ''
    }

    // Format date as DD.MM.YYYY
    const formatDateRo = (date: Date): string => {
      return format(new Date(date), 'dd.MM.yyyy')
    }

    // Calculate total receptii value for this ordonantare
    const totalReceptii = ordonantare.receptii.reduce((sum, r) => {
      return sum + Number(r.receptie.valoare)
    }, 0)

    // Create XML structure following ORDNT format
    const xml = create({ version: '1.0' })
      .ele('ORDNT', {
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'mfp:anaf:dgti:ORDNT:declaratie:v1',
        'xmlns': 'mfp:anaf:dgti:ORDNT:declaratie:v1',
        'DenInstPb': institutie.denumire || '',
        'Cif': institutie.cui || '',
        'NrOrdonantPl': ordonantare.numar,
        'DataOrdontPl': formatDateRo(ordonantare.dataord)
      })
      .ele('docFd', {
        'nr_unic_inreg': angajament.numar,
        'beneficiar': ordonantare.furnizor.denumire,
        'documente_justificative': `Factura nr. ${primareceptie.nrfact} din ${formatDateRo(primareceptie.datafact)}`,
        'cif_beneficiar': ordonantare.furnizor.codfiscal,
        'iban_beneficiar': ordonantare.furnizor.iban || '',
        'banca_beneficiar': getBancaFromIban(ordonantare.furnizor.iban),
        'inf_pv_plata': angajament.descriere,
        'inf_pv_plata1': 'null'
      })
      .ele('rowTfd', {
        'cod_angajament': modificareAngajament?.codang || '',
        'indicator_angajament': modificareAngajament?.indicator || '',
        'program': '0000001905',
        'cod_SSI': getCodSSI(),
        'receptii': totalReceptii.toFixed(2),
        'plati_anterioare': 'null',
        'suma_ordonantata_plata': Number(ordonantare.valoare).toFixed(2),
        'receptii_neplatite': '0'
      }).txt('')

    // Convert to string
    const xmlString = xml.end({ prettyPrint: false })

    // Set response headers for XML file download
    setResponseHeaders(event, {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="ORDNT-${ordonantare.numar}.xml"`,
      'Content-Length': Buffer.from(xmlString).length.toString()
    })

    return xmlString

  } catch (error) {
    console.error('Error generating ORDNT XML:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Eroare la generarea XML'
    })
  }
})
