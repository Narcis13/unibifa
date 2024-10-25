import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
//const route= useRoute()

export default defineEventHandler( async (event)=>{
const q = getQuery(event)
const {tip} = event.context.params
let inc={}
let w={}
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

if(tip=='Bugete'){
  inc.include= {
    
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

if(tip=='furnizori'){
 // console.log('furnizori',getQuery(event).cid)
  w.where={
    id_user:parseInt(getQuery(event).cid)
}
}
//console.log('cruta',q)
    return prisma[tip].findMany({
        ...inc,
        ...w,
        orderBy:[{id:'desc'}]
    });
})