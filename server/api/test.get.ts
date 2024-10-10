import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    // ... Do whatever you want here

   let posts= await prisma.post.findMany()
   
   console.log('POsts',posts)
  })