import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const compartimente=await prisma['compartimente'].findMany({
    where:{
        stare:'activ'
    },
    orderBy:[{denumire:'asc'}]
});
let comps = []
compartimente.map(c=>{
    comps.push({value:c.id,label:c.denumire})
})
    return comps;
})