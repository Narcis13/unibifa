import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default defineEventHandler( async (event)=>{
const body = await readBody(event);
const {tip} = event.context.params
console.log(tip)
/*const item = await prisma[tip+'i'].create(
    {
        data:body
    }
)
let rez={succes:true}
rez[tip]=item
//console.log('creez client',body)
    return rez;*/
    return {}
})