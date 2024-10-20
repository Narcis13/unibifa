import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const articole=await prisma['articolebugetare'].findMany({
    where:{
        stare:'activ'
    },
    orderBy:[{cod:'asc'}]
});
let arts = []
articole.map(a=>{
    arts.push({value:a.id,label:a.cod})
})
    return arts;
})