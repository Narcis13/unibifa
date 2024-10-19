import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
//const route= useRoute()

export default defineEventHandler( async (event)=>{
  const {tip} = event.context.params
const q = getQuery(event)
const body = await readBody(event);
//console.log('modific',tip)

body.updated_at=(new Date()).toISOString();
const updateitem = await prisma[tip].update({
    where: {
      id: parseInt(q.resid),
    },
    data: body,
  })

    return {succes:true,updateitem}
})