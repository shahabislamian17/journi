// Next.js API route handler - catch-all for /api/*
// Uses a simpler approach: directly call route handler functions

const path = require('path');

// Cache routers
const routers = {};
function getRouter(name) {
  if (!routers[name]) {
    routers[name] = require(path.join(process.cwd(), 'backend', 'routes', name));
  }
  return routers[name];
}

module.exports = async function handler(req, res) {
  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }

  const routeSegments = req.query.route || [];
  const [routeName, ...subPath] = routeSegments;

  if (!routeName) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const router = getRouter(routeName);
  if (!router) {
    return res.status(404).json({ error: `Route '${routeName}' not found` });
  }

  const apiPath = '/' + (subPath.length > 0 ? subPath.join('/') : '');
  const cleanQuery = { ...req.query };
  delete cleanQuery.route;

  console.log(`[API] ${req.method} /${routeName}${apiPath}`);

  // Create minimal request object
  const mockReq = Object.create(Object.prototype);
  mockReq.method = req.method;
  mockReq.url = apiPath + (Object.keys(cleanQuery).length ? '?' + new URLSearchParams(cleanQuery).toString() : '');
  mockReq.path = apiPath;
  mockReq.originalUrl = apiPath;
  mockReq.baseUrl = '';
  mockReq.query = cleanQuery;
  mockReq.body = req.body || {};
  mockReq.headers = req.headers || {};
  mockReq.params = {};
  mockReq.user = null;
  mockReq.get = function(name) {
    return this.headers[name?.toLowerCase()] || this.headers[name];
  };

  // Extract params
  if (subPath.length === 1) {
    mockReq.params.slug = subPath[0];
    mockReq.params.id = subPath[0];
  }
  if (subPath.length >= 2) {
    mockReq.params.id = subPath[1];
  }

  // Create response object
  let statusCode = 200;
  let headersSent = false;
  const mockRes = {
    statusCode: 200,
    headersSent: false,
    status(code) {
      statusCode = code;
      this.statusCode = code;
      return this;
    },
    json(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode);
      res.json(data);
      return this;
    },
    send(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      res.status(statusCode);
      res.send(data);
      return this;
    },
    end(data) {
      if (headersSent) return this;
      headersSent = true;
      this.headersSent = true;
      if (data) res.write(data);
      res.end();
      return this;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
      return this;
    },
    getHeader(name) {
      return res.getHeader(name);
    }
  };

  // Call router - use process() method if available, otherwise handle()
  return new Promise((resolve) => {
    const done = (err) => {
      if (err) {
        console.error(`[Router Error] ${routeName}:`, err);
        if (!headersSent && !res.headersSent) {
          res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
        }
      } else if (!headersSent && !res.headersSent) {
        res.status(404).json({ error: 'Route not found', path: apiPath, method: req.method });
      }
      resolve();
    };

    // Try router.handle() - this is the Express Router method
    if (typeof router.handle === 'function') {
      router.handle(mockReq, mockRes, done);
    } else {
      // Fallback: try calling router directly as middleware
      router(mockReq, mockRes, done);
    }
  });
};
