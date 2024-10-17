import type { User, TokensSession, Session } from "~~/mvc/misc/types";
import jwt from "jsonwebtoken";
import { H3Event, H3Error } from "h3";
import { getUserByName,getUserById,updateLastLogin } from "./users";
import { verifyPassword ,makeUuid } from "./passwords";
import { createUserSession ,getUserSession,deactivateUserSessions,endUserSession} from "./sessions";

export async function login(event: H3Event): Promise<H3Error | TokensSession> {
    const tokens = {} as TokensSession;
    const body = await readBody(event);
  
    if (!body)
      return createError({
        statusCode: 401,
        statusMessage: "No email or password provided",
      });
  
    const user = await getUserByName(body.name);
  
    if (user === null) {
      return createError({ statusCode: 401, statusMessage: "Invalid login" });
    }
  
    if (await verifyPassword(user.password, body.password)) {
      // Update last login time
      await updateLastLogin(user.name);
  
      const publicUser = {
        id: user.id,
        name: user.name,
      };
  
      // Create access token
      const accessToken = jwt.sign(publicUser, 'ALOP2030_by_Narcis', {
        expiresIn: "15m",
        issuer: "Braind",
        jwtid: makeUuid(),
      });
  

  
      // Assign tokens
      tokens.accessToken = accessToken;
     
  
      // Create user session, if error, return error
      const sessionOrTokenError = await createUserSession(
        user.id,
        accessToken,
        event
      );
  
      // If session error, return error
      if (sessionOrTokenError instanceof H3Error) {
        console.log("Trouble creating session");
        return createError({ statusCode: 500, statusMessage: "Server error" });
      }
  
      // Get session and session id
      const session = sessionOrTokenError as Session;
      tokens.sid = session.sid;
  
      return tokens;
    }
  
    return createError({ statusCode: 401, statusMessage: "Invalid login" });
  }


  /**
 * @desc Logs a user out
 * @param event Event from Api
 */
export async function logout(event: H3Event): Promise<H3Error | void> {
  let sessionOrError = {} as H3Error | Session;

  // Get session id and session
  const sessionId = getCookie(event, "alop-sid");
  if (sessionId) sessionOrError = await getUserSession(sessionId);

  // If error, log error but delete all cookies anyway
  if (sessionOrError instanceof H3Error) {
    console.log(
      "Error with logout. Sessions might not be disabled. Security risk."
    );
    console.log("Proceeding with removing all cookies");
    deleteCookie(event, "alop-access-token");
   
    deleteCookie(event, "alop-sid");
  }
  // Otherwise deactivate refresh tokens and all other user's sessions
  else {
    const session = sessionOrError as Session;
    const userOrNull = await getUserById(session.user_id);

    //console.log("Cookies and session id removed.");
    deleteCookie(event, "alop-access-token");
  
    deleteCookie(event, "alop-sid");

    // If no user, log error, but delete all cookies anyway
    if (userOrNull === null) {
      console.log("Error with logout. User not found");      
    } else {
      // Otherwise get user
      const user = userOrNull as User;
      // Deactivate all refresh tokens


      // Deactivate user sessions
      const deactivateSessionsError = await deactivateUserSessions(user.id);
      if (deactivateSessionsError instanceof H3Error)
        return deactivateSessionsError;

      // End user session
      let endUserSessionOrError = {} as H3Error | Session;
      if (sessionId) endUserSessionOrError = await endUserSession(sessionId);

      // If error, log error
      if (endUserSessionOrError instanceof H3Error) {
        console.log("Error ending user session in logout. Security risk");
      }
    }
  }
}