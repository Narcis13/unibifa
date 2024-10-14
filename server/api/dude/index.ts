import dudeController from "~~/mvc/dude/controller";

export default defineEventHandler(async (event) => {
  return dudeController(event);
});