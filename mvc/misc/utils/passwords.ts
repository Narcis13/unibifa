import argon2 from "argon2";
import { H3Error } from "h3";


/**
 * @desc Hashes a password or any string using Argon 2
 * @param password Unhashed password
 */
export async function hashPassword(
    password: string
  ): Promise<string | H3Error> {
    try {
      return await argon2.hash(password);
    } catch (err) {
      return createError({ statusCode: 500, statusMessage: "Password error" });
    }
  }