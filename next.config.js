/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: require('path').join(__dirname),
  
  // Include templates directory in Vercel build
  experimental: {
    outputFileTracingIncludes: {
      '/': ['templates/**/*'],
    },
  },
  
  // Webpack configuration to handle server-only modules
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude backend directory from webpack bundling completely
      const originalExternals = config.externals || [];
      config.externals = [
        ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
        // Function-based externals for dynamic requires
        ({ request, context }, callback) => {
          // Exclude any require that points to backend directory
          if (request && typeof request === 'string') {
            if (request.includes('backend/app.js') || 
                request.includes('backend/') ||
                request.endsWith('backend/app.js')) {
              return callback(null, `commonjs ${request}`);
            }
            // Also check resolved path
            try {
              const resolvedPath = require('path').resolve(context || process.cwd(), request);
              if (resolvedPath.includes('backend') && resolvedPath.includes('app.js')) {
                return callback(null, `commonjs ${request}`);
              }
            } catch (e) {
              // Ignore path resolution errors
            }
          }
          callback();
        }
      ];
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },

  async redirects() {
    const php = (source, destination) => ({
      source,
      destination,
      permanent: true,
    });

    return [
      php("/index.php", "/"),
      php("/wishlist.php", "/wishlist"),

      php("/resources/contact.php", "/resources/contact"),
      php("/resources/faqs.php", "/resources/faqs"),

      php("/checkout/index.php", "/checkout"),
      php("/checkout/confirmation.php", "/checkout/confirmation"),

      php("/ibiza/sightseeing/index.php", "/ibiza/sightseeing"),
      php("/ibiza/sightseeing/experience.php", "/ibiza/sightseeing/experience"),

      php("/account/log-in.php", "/account/log-in"),
      php("/account/register.php", "/account/register"),
      php("/account/reset-password.php", "/account/reset-password"),
      php("/account/bookings.php", "/account/bookings"),
      php("/account/profile.php", "/account/profile"),
      php("/account/login-security.php", "/account/login-security"),
      php("/account/forgot-password.php", "/account/forgot-password"),
      php("/account/messages.php", "/account/messages"),
    ];
  },
};

module.exports = nextConfig;
