import { H3Event,H3Error } from "h3";
import type { JSONResponse ,User, TokensSession} from "~~/mvc/misc/types";
import { registerUser,loginUser ,logoutUser,detailsOfUser} from "./queries";


/**
 * @desc Shows all doodads
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns doodads or error
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;  

  //const template = await getEjsView('about.ejs')
  //console.log(template)
  const info = "Toti utilizatorii"  
  response.status = "success";
  response.data = {
    info,
  };

  return response;
}

/**
 * @desc Creates a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>}
 */
export async function create(event: H3Event): Promise<JSONResponse> {
  // Return error because all users will be created from /authn/register endpoint
  const response = {} as JSONResponse;
  response.status = "fail";
  response.error = createError({
    statusCode: 422,
    statusMessage: "All users must be created from authn/register endpoint",
  });

  return response;
}

/**
 * @desc Registers (creates) a new user in database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of registering user or error
 */
export async function register(event: H3Event): Promise<JSONResponse> {  
  let response = {} as JSONResponse;
  const userOrError = await registerUser(event);

  // If error is returned
  if (userOrError instanceof H3Error) {
    response.status = "fail";
    response.error = userOrError;
    return response;
  }

  // Otherwise return user email
  const user = userOrError as User;
  response.status = "success";
  response.data = {
    id: user.id,
    name:user.name
  };

  return response;
}

/**
 * @desc Authenticate user into database
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of authenticating user or error
 */
export async function login(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;


  const errorOrTokens = await loginUser(event);

  // If error, return error
  if (errorOrTokens instanceof H3Error) {


    response.status = "fail";
    response.error = errorOrTokens;
    return response;
  }

  //Otherwise get tokens
  const tokens = errorOrTokens as TokensSession;

  // If platform is app dev/production, set tokens in header

    setCookie(event, "alop-access-token", "Bearer " + tokens.accessToken, {
      httpOnly: true,
      secure: true,
    });


    // Set session id in cookie
    if (tokens.sid) setCookie(event, "alop-sid", tokens.sid);




  // Create api result
  const body = await readBody(event);

  // If all is successful
  response.status = "success";
  response.data = {
    name: body.name,
  };
  return response;
}

/**
 * @desc Log user out
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Object mentioning success or failure of logging user out
 */
export async function logout(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;
  const errorOrTrue = await logoutUser(event);

  // If error, return error
  if (errorOrTrue instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrTrue;
    return response;
  }

  // Otherwise return successful logout response
  response.status = "success";
  return response;
}

export async function details(event:H3Event):Promise<JSONResponse> {
  const response = {} as JSONResponse;

  const errorOrUserDetails = await detailsOfUser(event)
  if (errorOrUserDetails instanceof H3Error) {
    response.status = "fail";
    response.error = errorOrUserDetails;
    return response;
  }

  response.status = "success";
  response.data = {
    details: errorOrUserDetails
  };
  return response;

}