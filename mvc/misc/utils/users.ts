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

  /**
 * @desc Returns user by user id
 * @param id User's id
 */
export async function getUserById(id: number): Promise<User | null> {
  let user = null;
  await prisma.users
    .findFirst({
      where: {
        id: id,
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

/**
 * @desc Updates user's last login value
 * @param email User's email
 */
export async function updateLastLogin(name: string): Promise<null | User> {
  let result = null;
  await prisma.users
    .update({
      where: {
        name: name,
      },
      data: {
        last_login: new Date(),
      },
    })
    .then(async (response) => {
      result = response;
    })
    .catch(async (e) => {
      console.error(e);
    });

  return result;
}