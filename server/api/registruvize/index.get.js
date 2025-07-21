import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { dataInceput, dataSfarsit } = query;

  if (!dataInceput || !dataSfarsit) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Data început și data sfârșit sunt obligatorii'
    });
  }

  try {
    const startDate = new Date(dataInceput);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dataSfarsit);
    endDate.setHours(23, 59, 59, 999);

    const registruvize = await prisma.regviza.findMany({
      where: {
        dataviza: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: [
        { dataviza: 'asc' },
        { nrvizac: 'asc' }
      ]
    });

    return {
      success: true,
      data: registruvize
    };
  } catch (error) {
    console.error('Error fetching regviza data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Eroare la încărcarea datelor'
    });
  }
});