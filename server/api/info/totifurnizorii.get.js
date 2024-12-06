import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const articole=await prisma['furnizori'].findMany({

    orderBy:[{denumire:'asc'}]
});
let arts = []
articole.map(a=>{
    arts.push({value:a.id,label:a.denumire})
})
    return arts;
})