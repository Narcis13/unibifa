import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const responsabili=await prisma['users'].findMany({
    where:{
        role:'RESPONSABIL'
    },
    orderBy:[{name:'asc'}]
});
let resp = []
responsabili.map(r=>{
    resp.push({value:r.id,label:r.name})
})
    return resp;
})