import { H3Event } from "h3";
import type { JSONResponse } from "~~/mvc/misc/types";


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
