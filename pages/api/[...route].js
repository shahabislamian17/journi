// Next.js API route handler - Bridge approach
// Passes requests directly to Express app instead of manual route matching
// This lets Express handle routing natively (method matching, param parsing, etc.)

const path = require('path');

// Get Express app instance (singleton pattern for serverless)
let expressApp;
if (!global.__expressApp) {
  // Import the Express app from backend/app.js
  const appPath = path.join(process.cwd(), 'backend', 'app.js');
  expressApp = require(appPath);
  global.__expressApp = expressApp;
} else {
  expressApp = global.__expressApp;
}

// Handler function
function handler(req, res) {
  // Log entry for debugging
  console.log('[API ENTRY]', {
    method: req.method,
    url: req.url,
    path: req.url,
    route: req.query.route
  });

  // Reconstruct the full path for Express
  // Next.js catch-all route: /api/[...route] becomes req.query.route = ['auth', 'register']
  // We need: /api/auth/register for Express
  const routeSegments = req.query.route;
  let segments = [];
  if (Array.isArray(routeSegments)) {
    segments = routeSegments.filter(Boolean);
  } else if (routeSegments) {
    segments = [routeSegments];
  }

  // Reconstruct full path
  const fullPath = '/api/' + segments.join('/');
  
  // Reconstruct query string (remove the 'route' param)
  const cleanQuery = { ...req.query };
  delete cleanQuery.route;
  const queryString = Object.keys(cleanQuery).length > 0 
    ? '?' + new URLSearchParams(cleanQuery).toString() 
    : '';

  // Update request object for Express
  // Express expects req.url and req.path to match its route definitions
  const expressReq = Object.create(req);
  expressReq.url = fullPath + queryString;
  expressReq.path = fullPath;
  expressReq.originalUrl = fullPath + queryString;
  expressReq.baseUrl = '';
  expressReq.params = {};

  // Ensure body is available (Next.js might have parsed it)
  if (req.body && !expressReq.body) {
    expressReq.body = req.body;
  }

  // Create Express response object wrapper
  // Express needs res.send(), res.json(), etc. which Next.js provides
  const expressRes = res;

  // Call Express app - it will handle routing, method matching, param extraction, etc.
  // Express will call the appropriate route handler based on path and method
  return new Promise((resolve, reject) => {
    // Express app is a function that takes (req, res, next)
    expressApp(expressReq, expressRes, (err) => {
      if (err) {
        console.error('[Express Bridge Error]:', err);
        if (!res.headersSent) {
          res.status(err.status || 500).json({ 
            error: err.message || 'Internal server error' 
          });
        }
        return reject(err);
      }
      // Response should have been sent by Express
      if (!res.headersSent) {
        console.error('[Express Bridge] No response sent by Express');
        res.status(500).json({ error: 'No response from Express handler' });
      }
      resolve();
    });
  });
}

// Export handler with config
module.exports = handler;
module.exports.config = {
  api: {
    externalResolver: true, // Tells Next.js to wait for Express to send the response
    bodyParser: false,      // Let Express handle body parsing (especially for POST/PUT)
  },
};
