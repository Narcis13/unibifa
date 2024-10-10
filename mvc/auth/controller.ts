import { createRouter, defineEventHandler, useBase } from 'h3';

const router = createRouter();

// Routes /api/iam/doodads

// Get all doodads
router.get('/', defineEventHandler(async (event) => { 
  return {mesaj:'dude'}
}));

// Create a doodad
router.post('/', defineEventHandler(async (event) => { 
  return {}
}));

// Get a single doodad
router.get('/:id', defineEventHandler(async (event) => { 
  return  {}
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

export default useBase('/api/auth', router.handler);