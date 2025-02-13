
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default defineEventHandler(async (event) => {
    const idcompartiment = Number(event.context.params?.idcompartiment)
    if (!idcompartiment) {
      throw createError({
        statusCode: 400,
        message: 'Invalid compartiment ID'
      })
    }
  
    // Get first day of current year
    const currentYear = new Date().getFullYear()
    const firstDayOfYear = new Date(currentYear, 0, 1)
  /*
    const angajamenteWithSums = await prisma.$queryRaw`
      SELECT 
        a.*,
        sf.scurt as sursa_denumire,
        ab.cod as articol_denumire,
        COUNT(m.id) as totalModificari,
        COUNT(CASE WHEN m.vizaCFPP = true THEN 1 END) as totalVizate,
        SUM(CASE WHEN m.tipModificare = 'MAJORARE' THEN m.suma ELSE 0 END) - 
        SUM(CASE WHEN m.tipModificare = 'DIMINUARE' THEN m.suma ELSE 0 END) as totalsuma,
        COALESCE(SUM(r.valoare), 0) as totalreceptii,
        (SUM(CASE WHEN m.tipModificare = 'MAJORARE' THEN m.suma ELSE 0 END) - 
         SUM(CASE WHEN m.tipModificare = 'DIMINUARE' THEN m.suma ELSE 0 END) - 
         COALESCE(SUM(r.valoare), 0)) as suma_disponibila
      FROM Angajamente a
      LEFT JOIN ModificariAngajamente m ON a.id = m.idAngajament
      LEFT JOIN Receptii r ON a.id = r.idAngajament
      LEFT JOIN Categorii cat ON cat.id = a.idCategorie
      LEFT JOIN sursefinantare sf ON sf.id = cat.idsursa
      LEFT JOIN articolebugetare ab ON ab.id = cat.idarticol
      WHERE a.data >= ${firstDayOfYear}
        AND a.idCompartiment = ${idcompartiment}
      GROUP BY a.id, sf.scurt, ab.cod
      HAVING COUNT(m.id) > 0 
        AND COUNT(m.id) = COUNT(CASE WHEN m.vizaCFPP = true THEN 1 END)
        AND suma_disponibila > 0
      ORDER BY sf.scurt, ab.cod
    `
  */

    const angajamenteWithSums = await prisma.$queryRaw`
    SELECT 
  a.id,
  a.*,
  sf.scurt as sursa_denumire,
  ab.cod as articol_denumire,
  COUNT(DISTINCT m.id) as totalModificari,
  COUNT(DISTINCT CASE WHEN m.vizaCFPP = true THEN m.id END) as totalVizate,
  (
    SUM( CASE WHEN m.tipModificare = 'MAJORARE' THEN m.suma ELSE 0 END) - 
    SUM( CASE WHEN m.tipModificare = 'DIMINUARE' THEN m.suma ELSE 0 END)
  ) as totalsuma,
  COALESCE((
    SELECT SUM(r2.valoare)
    FROM Receptii r2
    WHERE r2.idAngajament = a.id
  ), 0) as totalreceptii,
  (
    (SUM( CASE WHEN m.tipModificare = 'MAJORARE' THEN m.suma ELSE 0 END) - 
    SUM( CASE WHEN m.tipModificare = 'DIMINUARE' THEN m.suma ELSE 0 END)) - 
    COALESCE((
      SELECT SUM(r2.valoare)
      FROM Receptii r2
      WHERE r2.idAngajament = a.id
    ), 0)
  ) as suma_disponibila
FROM Angajamente a
LEFT JOIN ModificariAngajamente m ON a.id = m.idAngajament
LEFT JOIN Categorii cat ON cat.id = a.idCategorie
LEFT JOIN sursefinantare sf ON sf.id = cat.idsursa
LEFT JOIN articolebugetare ab ON ab.id = cat.idarticol
WHERE a.data >= ${firstDayOfYear}
  AND a.idCompartiment = ${idcompartiment}
GROUP BY 
  a.id, a.numar, a.data, a.idCategorie, a.idCompartiment, 
  a.descriere, a.exercitiuBugetar, a.created_at, a.updated_at,
  sf.scurt, ab.cod
HAVING 
  COUNT(DISTINCT m.id) > 0 
  AND COUNT(DISTINCT m.id) = COUNT(DISTINCT CASE WHEN m.vizaCFPP = true THEN m.id END)
  AND suma_disponibila > 0
ORDER BY sf.scurt, ab.cod
  `

    // Fetch related data in a separate efficient query
    const angajamenteWithRelations = await prisma.angajamente.findMany({
      where: {
        id: {
          in: (angajamenteWithSums as any[]).map(a => a.id)
        }
      },
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
        },
        receptii: {
          include: {
            furnizor: true
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    })
  
    const orderMap = new Map(
        (angajamenteWithSums as any[]).map((item, index) => [item.id, index])
      )
    
      // Sort the relations array to match the original order
      const sortedAngajamente = angajamenteWithRelations
        .sort((a, b) => (orderMap.get(a.id) || 0) - (orderMap.get(b.id) || 0))
    // Merge the raw sums with the relations
    return sortedAngajamente.map(angajament => {
      const sums = (angajamenteWithSums as any[]).find(a => a.id === angajament.id)
      return {
        ...angajament,
        vizatCFPP: sums.totalModificari > 0 && sums.totalModificari === sums.totalVizate,
        totalModificari: Number(sums.totalModificari),
        totalVizate: Number(sums.totalVizate),
        totalsuma: Number(sums.totalsuma),
        totalreceptii: Number(sums.totalreceptii),
        suma_disponibila: Number(sums.suma_disponibila)
      }
    })

})