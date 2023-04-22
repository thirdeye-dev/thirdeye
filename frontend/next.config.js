/** @type {import('next').NextConfig} */

const backendUrl = process.env.BACKEND_URL || "http://0.0.0.0:8000/";

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
        destination: `${backendUrl}:slug*`,
      },
    ];
  },
};

module.exports = nextConfig;
