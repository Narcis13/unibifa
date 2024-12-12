
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id)
    try {
    if (isNaN(id) || id <= 0) {
        throw createError({
          statusCode: 400,
          message: 'Invalid modification ID'
        })
      }
  
      // Perform a detailed query with nested relations
      const modificareAngajament = await prisma.modificariAngajamente.findUnique({
        where: { id },
        include: {
          angajament: {
            include: {
              categorie: {
                include: {
                  articolBugetar: true,
                  sursaFinantare: true,
                  compartiment: true
                }
              }
            }
          },
          user: true
        }
      })
  
      // Check if the record exists
      if (!modificareAngajament) {
        throw createError({
          statusCode: 404,
          message: 'Modificare Angajament not found'
        })
      }
  
      // Transform the result to extract specific fields
      return {
        ...modificareAngajament,
        articolBugetar: {
          cod: modificareAngajament.angajament.categorie.articolBugetar.cod
        },
        sursaFinantare: {
          cod: modificareAngajament.angajament.categorie.sursaFinantare.cod
        },
        compartiment: {
          denumire: modificareAngajament.angajament.categorie.compartiment.denumire
        },
        angajamente: {
          ...modificareAngajament.angajament,
          // You can add or remove specific fields as needed
          categorieId: modificareAngajament.angajament.idCategorie
        }
      }
    } catch (error) {
      // Handle any errors
      console.error('Error fetching Modificari Angajamente:', error)
      
      // If it's an error we created, rethrow it
      if (error.statusCode) {
        throw error
      }
      
      // Otherwise, create a generic server error
      throw createError({
        statusCode: 500,
        message: 'Internal Server Error'
      })
    }
})