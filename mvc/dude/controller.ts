import { createRouter, defineEventHandler, useBase } from 'h3';
import { index,getTemplate } from './model';
const router = createRouter();

// Routes /api/iam/doodads

// Get all doodads
router.get('/', defineEventHandler(async (event) => { 
  return await index(event)
}));

// Create a doodad
router.post('/', defineEventHandler(async (event) => { 
  return {}
}));

// Get a single doodad
router.get('/:uuid', defineEventHandler(async (event) => { 
  return  await getTemplate(event)
}));

// Edit a doodad
router.put('/:id', defineEventHandler(async (event) => { 
  return {}
}));

// Delete a doodad
router.delete('/:id', defineEventHandler(async (event) => { 
  return {}
}));

// Example complex route
router.get('/:id/abc/:author-id', defineEventHandler((event) => { 
  const headers = getHeaders(event);
  return {
    params: event.context.params,
    headers: headers,
  }
}));

export default useBase('/api/dude', router.handler);