import { H3Event, H3Error } from "h3";
import { getUserByName } from "../utils/users";
/**
 * @desc Suite of checks to validate user before registration
 * @param event Event from Api
 * @info returns NuxtError HTTP status code if comething is wrong
 */
export async function validateUserRegistration(
    event: H3Event
  ): Promise<H3Error | void> {
    const body = await readBody(event);
  
    // Check if body contains first_name, last_name, email, and password
    const bodyError = await validateRegisterBody(event);
    if (bodyError) {
      return createError({ statusCode: 400, statusMessage: bodyError });
    }

  
    // If a user with that email already exists, return error
    const user = await getUserByName(body.name);
    if (user)
      return createError({
        statusCode: 409,
        statusMessage: "Name already exists",
      });
  
    // Check password meets minimum strength requirements
    if (!validatePassword(body.password)) {
      return createError({
        statusCode: 400,
        statusMessage: `Poor password strength. Password must contain at least 8 characters, an upper-case letter, and a lower-case letter, 
          a number, and a non-alphanumeric character.`,
      });
    }
  }

  /**
 * @desc Checks whether the body in register post request is in correct format
 * @param body Body object passed in register post request
 */
export async function validateRegisterBody(event: H3Event) {
    const body = await readBody(event);
    if ("first_name" in body === false || body.first_name.trim() === "") {
      return "'first_name' is required";
    }
  
    if ("last_name" in body === false || body.last_name.trim() == "") {
      return "'last_name' is required";
    }
  
    if ("name" in body === false) {
      return "'name' is required";
    }
  
    if ("password" in body === false) {
      return "'password' is required";
    }
  }

  /**
 * @desc Checks whether password matches a certain strength
 * @param password User's password
 * @return { <boolean> }
 */
export function validatePassword(password: string): boolean {
    // Has at least 8 characters
    if (password.length < 8) return false;
  
    // Has uppercase letters
    if (!/[A-Z]/.test(password)) return false;
  
    // Has lowercase letters
    if (!/[a-z]/.test(password)) return false;
  
    // Has numbers
    if (!/\d/.test(password)) return false;
  
    // Has non-alphanumeric characters
    if (!/\W/.test(password)) return false;
  
    return true;
  }