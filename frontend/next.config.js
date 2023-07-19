/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const backendUrl = process.env.BACKEND_HOST || "localhost:8000";

const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/logout",
        destination: "/auth/logout",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: `http://${backendUrl}/:slug*`,
      },
    ];
  },
};

module.exports = removeImports(nextConfig);
