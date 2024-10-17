import argon2 from "argon2";
import { H3Error } from "h3";
import { v4 as uuidv4 } from "uuid";

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

  /**
 * @desc Makes a uuid
 */
export function makeUuid(): string {
  return uuidv4();
}

/**
 * @desc Verifies password against a hash
 * @param hash Hashed password
 * @param password Unhashed password
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}