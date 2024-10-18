import { H3Event,H3Error } from "h3";
import type { User,TokensSession,UserDetails} from "~~/mvc/misc/types";
import { validateUserRegistration , validateUserLogin} from "~~/mvc/misc/utils/validators";
import { hashPassword } from "../misc/utils/passwords";
import { PrismaClient } from "@prisma/client";
import { login,logout } from "~~/mvc/misc/utils/logins";

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

  /**
 * @desc Authenticate user into database
 * @param event H3Event
 */
export async function loginUser(
  event: H3Event
): Promise<TokensSession | H3Error> {
  const validateError = await validateUserLogin(event);
  if (validateError instanceof H3Error) return validateError;

  const loginErrorOrTokens = await login(event);
  if (loginErrorOrTokens instanceof H3Error) return loginErrorOrTokens;

  const tokens = loginErrorOrTokens as TokensSession;

  return tokens;
}

/**
 * @desc Log user out
 * @param event H3Event
 */
export async function logoutUser(event: H3Event): Promise<boolean | H3Error> {
  const error = await logout(event);
  if (error instanceof H3Error) return error;

  // Create api result
  return true;
}

export async function detailsOfUser(event: H3Event): Promise<UserDetails | H3Error> {
  let error=null
  let details=null
  const name=event.context.params?.name
  await prisma.users
    .findFirst({
      where: {
        name: name,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        name: true,
        role: true,
      }
    })
    .then(async (response) => {
      details = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

    // Check for database errors
    if (error) {
     
      return createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    }
  
    // If we have a session, return it
    if (details) return details as UserDetails;
  
    // Otherwise, return an error
   
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  // Create api result

}

export async function institutie(event: H3Event): Promise<any | H3Error> {
  let error=null
  let institutie=null

  await prisma.institutie
    .findMany()
    .then(async (response) => {
      institutie = response;
    })
    .catch(async (e) => {
      console.error(e);
      error = e;
    });

    // Check for database errors
    if (error) {
     
      return createError({
        statusCode: 500,
        statusMessage: "Server error",
      });
    }
  
    // If we have a session, return it
    if (institutie) return institutie ;
  
    // Otherwise, return an error
   
    return createError({
      statusCode: 500,
      statusMessage: "Server error",
    });
  // Create api result

}