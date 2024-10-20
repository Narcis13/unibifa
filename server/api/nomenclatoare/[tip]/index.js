import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
//const route= useRoute()

export default defineEventHandler( async (event)=>{
const q = getQuery(event)
const {tip} = event.context.params
let inc={}
if(tip=='compartimente'){
    inc.include= {
        responsabil: {
          select: {
            name: true
          }
        }
      }
}

if(tip=='Categorii'){
   inc.include= {
        compartiment: {
          select: {
            denumire: true
          }
        },
        articolBugetar: {
          select: {
            cod: true
          }
        },
        sursaFinantare: {
          select: {
            scurt: true
          }
        }
      }
}
//console.log('cruta',q)
    return prisma[tip].findMany({
        ...inc,
        orderBy:[{id:'desc'}]
    });
})