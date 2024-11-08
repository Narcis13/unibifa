import { PrismaClient } from '@prisma/client'
import type { CreateAngajamentDTO } from '~/types/angajamente'
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event)
    const exercitiuBugetar = Number(query.an) || new Date().getFullYear()
    const from=query.from!.toString().replace(/\//g, '-')
    const to=query.to!.toString().replace(/\//g, '-')
    let whereClause = {
      data: {
        gte: new Date(from),
        lte: new Date(to)
      }
    }

    // Add compartiment filter if 'compartiment' is in the query
    if ('compartiment' in query) {
      whereClause.idCompartiment = Number(query.compartiment)
    } else {
      // Otherwise, get all angajamente where idCompartiment > 0
      whereClause.idCompartiment = { gt: 0 }
    }
    console.log('from',from,query.to,'compartiment' in query)
    return await prisma.angajamente.findMany({
      where: whereClause,
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
    const numar = `A${body.exercitiuBugetar}-${(count + 1).toString().padStart(4, '0')}`

    // Get validation data for initial modification
    const validationResult = await $fetch('/api/angajamente/validate', {
      method: 'POST',
      body: {
        idCategorie: body.idCategorie,
        suma: body.suma
      }
    })

    if (!validationResult.valid) {
      throw createError({
        statusCode: 400,
        message: 'Fonduri insuficiente pentru suma specificată'
      })
    }

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

      // Create initial modification
      await tx.modificariAngajamente.create({
        data: {
          idAngajament: angajament.id,
          tipModificare: 'MAJORARE',
          suma: body.suma,
          motiv: 'Creare angajament',
          idUser: body.idUser, // Use idUser from DTO
          sumaBuget: validationResult.sumaBuget,
          disponibilBugetar: validationResult.disponibilBugetar
        }
      })

      return angajament
    })

    return result
  }
})
