import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const {userid} = event.context.params
const compartiment=await prisma['compartimente'].findFirst({
    where:{
        idresponsabil:parseInt(userid)
    }
});
//console.log(compartiment)
    return compartiment;
})