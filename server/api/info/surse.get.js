import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const surse=await prisma['sursefinantare'].findMany({
    where:{
        stare:'activ'
    },
    orderBy:[{scurt:'asc'}]
});
let srs = []
surse.map(s=>{
    srs.push({value:s.id,label:s.scurt})
})
    return srs;
})