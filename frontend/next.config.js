/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")(); // get rid of this whenever possible

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const nextConfig = {
  experimental: {
    esmExternals: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["cryptologos.cc"],
  },
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
    const rewrites = [];

    rewrites.push({
      source: "/api/v1/:slug*",
      destination: `${backendUrl}/:slug*`,
    });

    return rewrites;
  },
};

module.exports = removeImports(nextConfig);
