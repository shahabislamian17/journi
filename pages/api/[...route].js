// Next.js API route handler - Bridge approach
// Passes requests directly to Express app instead of manual route matching
// This lets Express handle routing natively (method matching, param parsing, etc.)

const path = require('path');

// Get Express app instance (singleton pattern for serverless)
// Use lazy loading to avoid webpack trying to bundle it at build time
function getExpressApp() {
  if (global.__expressApp) {
    return global.__expressApp;
  }
  
  try {
    // Import the Express app from backend/app.js
    // Build path using variables that webpack can't statically analyze
    const fs = require('fs');
    const cwd = process.cwd(); // Get at runtime, not build time
    const parts = ['backend', 'app.js']; // Split path to prevent static analysis
    const appPath = path.join(cwd, ...parts);
    
    // Verify file exists
    if (!fs.existsSync(appPath)) {
      throw new Error(`Backend app.js not found at: ${appPath}`);
    }
    
    // Use eval with a template string to prevent webpack from analyzing
    // This is safe because it only runs server-side
    const appModule = eval(`require(${JSON.stringify(appPath)})`);
    
    global.__expressApp = appModule;
    console.log('[API] Express app loaded successfully from:', appPath);
    return appModule;
  } catch (error) {
    console.error('[API] Failed to load Express app:', error);
    console.error('[API] Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    // Create error handler that returns proper error
    const errorHandler = (req, res, next) => {
      res.status(500).json({ 
        error: 'Backend server not available',
        message: error.message || 'Failed to load Express app',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    };
    global.__expressApp = errorHandler;
    return errorHandler;
  }
}

// Handler function
function handler(req, res) {
  // Log entry for debugging
  console.log('[API ENTRY]', {
    method: req.method,
    url: req.url,
    originalUrl: req.url,
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

  // If no segments, try to extract from URL
  if (segments.length === 0 && req.url) {
    const urlPath = req.url.split('?')[0]; // Remove query string
    const pathParts = urlPath.split('/').filter(Boolean);
    if (pathParts[0] === 'api' && pathParts.length > 1) {
      segments = pathParts.slice(1); // Get everything after /api
    }
  }

  // Reconstruct full path - ALWAYS include /api prefix
  let fullPath = '/api/' + segments.join('/');
  
  // Ensure we have a valid path
  if (segments.length === 0) {
    console.error('[Bridge] No route segments found. URL:', req.url, 'Query:', req.query);
    return res.status(404).json({ error: 'API route not found' });
  }
  
  // Reconstruct query string (remove the 'route' param)
  const cleanQuery = { ...req.query };
  delete cleanQuery.route;
  const queryString = Object.keys(cleanQuery).length > 0 
    ? '?' + new URLSearchParams(cleanQuery).toString() 
    : '';

  // CRITICAL: Fix the URL - Express needs the /api prefix to match routes
  // Vercel/Next.js might strip /api from req.url, so we always use our reconstructed path
  // This ensures Express routes (app.use('/api/reviews', ...)) can match correctly
  const finalUrl = fullPath + queryString;
  
  // Update request object for Express
  // Express expects req.url and req.path to match its route definitions
  const expressReq = Object.create(req);
  expressReq.url = finalUrl;
  expressReq.path = fullPath;
  expressReq.originalUrl = finalUrl;
  expressReq.baseUrl = '';
  expressReq.params = {};

  // Ensure body is available - Next.js will parse it with bodyParser config
  // Copy all request properties to Express request
  if (req.body) {
    expressReq.body = req.body;
  }
  
  // Copy headers to ensure Express gets all necessary headers
  expressReq.headers = { ...req.headers };
  
  // Ensure Content-Type is preserved for Express body parsing
  if (req.headers['content-type']) {
    expressReq.headers['content-type'] = req.headers['content-type'];
  }
  
  // Mark that body is already parsed (so Express doesn't try to parse again)
  // We'll handle this by not using Express body parser middleware for these requests
  // But since we're passing through, Express will still try to parse
  // So we need to ensure the body is in the right format

  // Log the path being sent to Express for debugging
  console.log('[Bridge] Passing to Express:', {
    method: expressReq.method,
    url: expressReq.url,
    path: expressReq.path
  });

  // Get Express app (lazy load to avoid webpack bundling)
  const expressApp = getExpressApp();
  
  // Call Express app - it will handle routing, method matching, param extraction, etc.
  // Express will call the appropriate route handler based on path and method
  // Wrap in Promise to prevent Vercel from killing the function early
  return new Promise((resolve, reject) => {
    // Set a timeout to ensure we always respond
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        console.error('[Bridge] Timeout - no response from Express');
        res.status(500).json({ error: 'Request timeout' });
        resolve();
      }
    }, 30000); // 30 second timeout

    // Express app is a function that takes (req, res, next)
    expressApp(expressReq, res, (err) => {
      clearTimeout(timeout);
      if (err) {
        console.error('[Bridge Error]:', err);
        if (!res.headersSent) {
          res.status(err.status || 500).json({ 
            error: err.message || 'Internal server error' 
          });
        }
        return reject(err);
      }
      // Response should have been sent by Express
      if (!res.headersSent) {
        console.error('[Bridge] No response sent by Express for:', fullPath);
        res.status(404).json({ error: 'Route not found in Express', path: fullPath });
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
    bodyParser: {
      sizeLimit: '1mb',
    }, // Enable body parsing for POST/PUT requests
  },
};
