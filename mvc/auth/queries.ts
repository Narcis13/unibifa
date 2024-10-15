import { H3Event,H3Error } from "h3";
import type { User} from "~~/mvc/misc/types";
import { validateUserRegistration } from "~~/mvc/misc/utils/validators";
import { hashPassword } from "../misc/utils/passwords";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

/**
 * @desc Registers (creates) a new user in database
 * @param event H3Event
 * @return {Promise<string>} Returns user if successful and error if not successful
 */
export async function registerUser(event: H3Event): Promise<User | H3Error> {
    const validationError = await validateUserRegistration(event);  
    if (validationError) return validationError; 
  
    const body = await readBody(event);
  
    // Attempt to hash password, if error, return error
    const hashedPasswordOrError = await hashPassword(body.password);
    if (hashedPasswordOrError instanceof H3Error) return hashedPasswordOrError;
  
    // If no password hash error, get password as string
    const hashedPassword = hashedPasswordOrError as string;
  
    let user = {};
  
    let registrationError = null;
    await prisma.users
      .create({
        data: {
          first_name: body.first_name.trim(),
          last_name: body.last_name.trim(),
          name: body.name,
          password: hashedPassword,
        },
      })
      .then(async (response) => {
        user = response;
      })
      .catch(async (e) => {
        console.error(e);
        registrationError = e;
      });
  
    if (registrationError)
      throw createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
  
    // Create api result
    const newUser = user as User;
    return newUser;
  }