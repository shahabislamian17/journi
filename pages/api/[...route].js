// Next.js API route handler - catch-all for /api/*
// Manually routes to backend route handlers

const path = require('path');
const http = require('http');

// Lazy load routes
const routeModules = {};

function getRouteModule(name) {
  if (!routeModules[name]) {
    const backendPath = path.join(process.cwd(), 'backend', 'routes');
    routeModules[name] = require(path.join(backendPath, name));
  }
  return routeModules[name];
}

// Helper to create proper Node.js request/response for Express
function createExpressReqRes(nextReq, nextRes, apiPath, routeSegments) {
  // Parse body if needed
  let body = nextReq.body || {};
  
  // Create a mock IncomingMessage
  const nodeReq = new http.IncomingMessage(null);
  nodeReq.method = nextReq.method;
  nodeReq.url = apiPath + (nextReq.url.includes('?') ? nextReq.url.substring(nextReq.url.indexOf('?')) : '');
  nodeReq.path = apiPath;
  nodeReq.originalUrl = apiPath;
  nodeReq.baseUrl = '';
  nodeReq.query = { ...nextReq.query, route: undefined };
  nodeReq.body = body;
  nodeReq.headers = { ...nextReq.headers };
  nodeReq.params = {};
  nodeReq.user = nextReq.user;
  nodeReq.get = function(name) {
    return this.headers[name?.toLowerCase()] || this.headers[name];
  };
  
  // Extract path params
  if (routeSegments.length >= 2) {
    nodeReq.params.slug = routeSegments[1];
    nodeReq.params.id = routeSegments[1];
  }
  if (routeSegments.length >= 3) {
    nodeReq.params.id = routeSegments[2];
  }
  
  // Create a mock ServerResponse
  const nodeRes = new http.ServerResponse(nodeReq);
  let statusCode = 200;
  let headersSent = false;
  
  // Override methods to use Next.js response
  nodeRes.status = function(code) {
    statusCode = code;
    this.statusCode = code;
    nextRes.statusCode = code;
    return this;
  };
  
  nodeRes.json = function(data) {
    if (headersSent) return this;
    headersSent = true;
    nextRes.setHeader('Content-Type', 'application/json');
    nextRes.status(statusCode || 200);
    return nextRes.json(data);
  };
  
  nodeRes.send = function(data) {
    if (headersSent) return this;
    headersSent = true;
    nextRes.status(statusCode || 200);
    return nextRes.send(data);
  };
  
  nodeRes.end = function(data) {
    if (headersSent) return this;
    headersSent = true;
    if (data) nextRes.write(data);
    return nextRes.end();
  };
  
  nodeRes.setHeader = function(name, value) {
    nextRes.setHeader(name, value);
    return this;
  };
  
  nodeRes.getHeader = function(name) {
    return nextRes.getHeader(name);
  };
  
  return { nodeReq, nodeRes };
}

module.exports = async function handler(req, res) {
  // Handle OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  // Get route segments: /api/auth/login -> ['auth', 'login']
  const routeSegments = req.query.route || [];
  const [routeName, ...subPath] = routeSegments;
  
  if (!routeName) {
    return res.status(404).json({ error: 'API endpoint not found', path: req.url });
  }

  console.log(`[API Handler] ${req.method} /${routeName}/${subPath.join('/')} (segments: [${routeSegments.join(', ')}])`);

  try {
    // Get the route module (Express router)
    const routeModule = getRouteModule(routeName);
    
    // Reconstruct the path for the route
    const apiPath = '/' + (subPath.length > 0 ? subPath.join('/') : '');
    
    // Create Express-compatible req/res
    const { nodeReq, nodeRes } = createExpressReqRes(req, res, apiPath, routeSegments);
    
    // Call the Express router
    return new Promise((resolve) => {
      // Handle the request through the router
      routeModule(nodeReq, nodeRes, (err) => {
        if (err) {
          console.error(`[Router Error] ${routeName}:`, err);
          if (!nodeRes.headersSent && !res.headersSent) {
            res.status(err.status || 500).json({ 
              error: err.message || 'Internal server error' 
            });
          }
        } else if (!nodeRes.headersSent && !res.headersSent) {
          // If router didn't respond, send 404
          res.status(404).json({ 
            error: 'Route handler did not respond',
            path: apiPath,
            method: req.method
          });
        }
        resolve();
      });
    });
    
  } catch (error) {
    console.error(`[API Error] ${routeName}:`, error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      route: routeName
    });
  }
};
