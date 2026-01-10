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
