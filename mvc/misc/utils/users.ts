import { PrismaClient } from "@prisma/client";
import type { User } from "~~/mvc/misc/types";
//import { H3Error, H3Event } from "h3";


const prisma = new PrismaClient();

/**
 * @desc Returns user by email
 * @param email User's email
 */
export async function getUserByName(name: string): Promise<User | null> {
    let user = null;
    await prisma.users
      .findFirst({
        where: {
          name: name,
        },
      })
      .then(async (response) => {
        user = response;
      })
      .catch(async (e) => {
        console.error(e);
      });
  
    return user;
  }