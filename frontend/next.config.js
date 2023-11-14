/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

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
};

module.exports = removeImports(nextConfig);

module.exports.typescript = {
  ignoreBuildErrors: true,
};
