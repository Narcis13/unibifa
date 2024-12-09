import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
const institutie=await prisma['institutie'].findFirst();

    return institutie;
})