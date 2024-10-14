import { H3Event } from "h3";
import type { JSONResponse } from "~~/mvc/misc/types";
import { compile } from "ejs";

const EJS_STORAGE_KEY = 'assets:server:views'

async function getEjsView(key: string) {
    const ejsViewStorage = useStorage(EJS_STORAGE_KEY)
    return await ejsViewStorage.getItem<string>(key).then((item) => Buffer.from(item!).toString())
  }
/**
 * @desc Shows all doodads
 * @param event H3 Event passed from api
 * @returns {Promise<JSONResponse>} Returns doodads or error
 */
export async function index(event: H3Event): Promise<JSONResponse> {
  const response = {} as JSONResponse;  

  //const template = await getEjsView('about.ejs')
  //console.log(template)
  const info = "get all doodads"  
  response.status = "success";
  response.data = {
    info,
  };

  return response;
}

export async function getTemplate(event: H3Event): Promise<JSONResponse> {
  //  const response = {} as JSONResponse;  
    const uuid = event.context.params?.uuid
    const template = await getEjsView(uuid+'.ejs')
    const templateFn = compile(template)
    return templateFn()
    
  }