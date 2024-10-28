import { PrismaClient } from '@prisma/client'


import type { CreateAngajamentDTO } from '~/types/angajamente'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event)
    const exercitiuBugetar = Number(query.an) || new Date().getFullYear()

    return await prisma.angajamente.findMany({
      where: { exercitiuBugetar },
      include: {
        categorie: {
          include: {
            sursaFinantare: true,
            articolBugetar: true
          }
        },
        compartiment: true,
        modificari: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  }

  if (event.method === 'POST') {
    const body = await readBody<CreateAngajamentDTO>(event)
    
    // Generate unique number for angajament
    const count = await prisma.angajamente.count({
      where: { exercitiuBugetar: body.exercitiuBugetar }
    })
    const numar = `${body.exercitiuBugetar}-${(count + 1).toString().padStart(4, '0')}`

    // Create angajament and initial modification
    const result = await prisma.$transaction(async (tx) => {
      const angajament = await tx.angajamente.create({
        data: {
          numar,
          idCategorie: body.idCategorie,
          idCompartiment: body.idCompartiment,
          descriere: body.descriere,
          exercitiuBugetar: body.exercitiuBugetar
        },
        include: {
          categorie: {
            include: {
              sursaFinantare: true,
              articolBugetar: true
            }
          },
          compartiment: true
        }
      })

      // Get current budget amount and available funds
      const categorie = await tx.categorii.findUnique({
        where: { id: body.idCategorie },
        include: {
          sursaFinantare: true,
          articolBugetar: true
        }
      })

      const buget = await tx.bugete.findUnique({
        where: {
          idSursa_idArticol: {
            idSursa: categorie!.idsursa,
            idArticol: categorie!.idarticol
          }
        }
      })

      const sumaBuget = buget?.total || 0
      
      // Calculate available funds by subtracting all existing commitments
      const angajamenteExistente = await tx.angajamente.findMany({
        where: {
          idCategorie: body.idCategorie,
          exercitiuBugetar: body.exercitiuBugetar
        },
        include: {
          modificari: true
        }
      })

      const sumaAngajata = angajamenteExistente.reduce((total, ang) => {
        const sumaModificari = ang.modificari.reduce((sum, mod) => {
          return sum + (mod.tipModificare === 'MAJORARE' ? mod.suma : -mod.suma)
        }, 0)
        return total + Number(sumaModificari)
      }, 0)

      const disponibilBugetar = Number(sumaBuget) - sumaAngajata

      // Create initial modification
      await tx.modificariAngajamente.create({
        data: {
          idAngajament: angajament.id,
          tipModificare: 'MAJORARE',
          suma: body.sumaInitiala,
          motiv: 'Creare angajament',
          idUser: event.context.user.id,
          sumaBuget,
          disponibilBugetar
        }
      })

      return angajament
    })

    return result
  }
})
