// Next.js API route handler - catch-all for /api/*
// Routes to backend Express routers using Router.handle()

const path = require('path');

// Route mapping
const routeMap = {
  auth: 'auth',
  experiences: 'experiences',
  categories: 'categories',
  bookings: 'bookings',
  wishlist: 'wishlist',
  reviews: 'reviews',
  messages: 'messages',
  stays: 'stays',
  cars: 'cars',
  stripe: 'stripe'
};

// Cache loaded routers
const routers = {};

function getRouter(name) {
  if (!routers[name] && routeMap[name]) {
    const backendPath = path.join(process.cwd(), 'backend', 'routes');
    routers[name] = require(path.join(backendPath, routeMap[name]));
  }
  return routers[name];
}

// Helper to create minimal req/res objects that Express Router can handle
function createMockRequest(method, path, query, body, headers, segments) {
  const mockReq = {
    method: method,
    url: path + (Object.keys(query).length > 0 ? '?' + new URLSearchParams(query).toString() : ''),
    path: path,
    originalUrl: path,
    baseUrl: '',
    query: query,
    body: body || {},
    headers: headers || {},
    params: {},
    user: null,
    get: function(name) {
      const key = name?.toLowerCase();
      return this.headers[key] || this.headers[name];
    },
    // Add stream-like methods Express might check
    on: function(event, handler) {
      if (event === 'data' && this.body) {
        setImmediate(() => handler(Buffer.from(JSON.stringify(this.body))));
      } else if (event === 'end') {
        setImmediate(handler);
      }
      return this;
    },
    pipe: function() { return this; },
    readable: true,
  };
  
  // Extract path params from segments
  if (segments.length >= 2) {
    mockReq.params.slug = segments[1];
    mockReq.params.id = segments[1];
  }
  if (segments.length >= 3) {
    mockReq.params.id = segments[2];
  }
  
  return mockReq;
}

function createMockResponse(nextRes) {
  let statusCode = 200;
  let headersSent = false;
  const headers = {};
  
  return {
    statusCode: statusCode,
    headersSent: false,
    status: function(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      if (headersSent || this.headersSent) {
        console.warn('[Response] Attempted to send response after headers sent');
        return this;
      }
      headersSent = true;
      this.headersSent = true;
      nextRes.setHeader('Content-Type', 'application/json');
      nextRes.status(statusCode || 200);
      nextRes.json(data);
      return this;
    },
    send: function(data) {
      if (headersSent || this.headersSent) {
        console.warn('[Response] Attempted to send response after headers sent');
        return this;
      }
      headersSent = true;
      this.headersSent = true;
      nextRes.status(statusCode || 200);
      nextRes.send(data);
      return this;
    },
    end: function(data) {
      if (headersSent || this.headersSent) {
        return this;
      }
      headersSent = true;
      this.headersSent = true;
      if (data) {
        nextRes.write(data);
      }
      nextRes.end();
      return this;
    },
    setHeader: function(name, value) {
      headers[name] = value;
      nextRes.setHeader(name, value);
      return this;
    },
    getHeader: function(name) {
      return headers[name] || nextRes.getHeader(name);
    },
    removeHeader: function(name) {
      delete headers[name];
      nextRes.removeHeader(name);
      return this;
    },
    write: function(chunk) {
      nextRes.write(chunk);
      return this;
    },
    writeHead: function(code, headersObj) {
      statusCode = code;
      this.statusCode = code;
      if (headersObj) {
        Object.entries(headersObj).forEach(([k, v]) => {
          headers[k] = v;
          nextRes.setHeader(k, v);
        });
      }
      nextRes.statusCode = code;
      return this;
    }
  };
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

  // Get route segments
  const routeSegments = req.query.route || [];
  const [routeName, ...subPath] = routeSegments;
  
  if (!routeName || !routeMap[routeName]) {
    return res.status(404).json({ 
      error: 'API endpoint not found',
      path: req.url,
      availableRoutes: Object.keys(routeMap)
    });
  }

  console.log(`[API] ${req.method} /${routeName}${subPath.length > 0 ? '/' + subPath.join('/') : ''}`);

  try {
    // Get the router
    const router = getRouter(routeName);
    
    if (!router) {
      return res.status(500).json({ error: `Failed to load ${routeName} router` });
    }

    // Reconstruct path (without route name, as router is already mounted)
    const apiPath = '/' + (subPath.length > 0 ? subPath.join('/') : '');
    
    // Clean query - remove 'route' param
    const cleanQuery = { ...req.query };
    delete cleanQuery.route;
    
    // Create mock request/response
    const mockReq = createMockRequest(
      req.method,
      apiPath,
      cleanQuery,
      req.body,
      req.headers,
      routeSegments
    );
    
    const mockRes = createMockResponse(res);
    
    // Use Router.handle() method directly
    return new Promise((resolve) => {
      let handled = false;
      
      // Set timeout to detect if router doesn't respond
      const timeout = setTimeout(() => {
        if (!handled && !mockRes.headersSent) {
          handled = true;
          console.error(`[API Timeout] ${req.method} ${apiPath} - Router did not respond`);
          res.status(504).json({ error: 'Request timeout - route handler did not respond' });
          resolve();
        }
      }, 30000); // 30 second timeout
      
      // Call router.handle()
      router.handle(mockReq, mockRes, (err) => {
        clearTimeout(timeout);
        if (handled) return;
        handled = true;
        
        if (err) {
          console.error(`[Router Error] ${routeName}:`, err);
          if (!mockRes.headersSent && !res.headersSent) {
            res.status(err.status || 500).json({ 
              error: err.message || 'Internal server error' 
            });
          }
        } else if (!mockRes.headersSent && !res.headersSent) {
          // Router didn't handle the request
          console.error(`[Router] ${routeName} did not handle ${req.method} ${apiPath}`);
          res.status(404).json({ 
            error: 'Route not handled',
            path: apiPath,
            method: req.method,
            route: routeName
          });
        }
        resolve();
      });
    });
    
  } catch (error) {
    console.error(`[API Error] ${routeName}:`, error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
