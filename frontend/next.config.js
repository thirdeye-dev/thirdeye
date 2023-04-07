/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: "http://0.0.0.0:8000/:slug*",
      },
    ];
  },
};

module.exports = nextConfig;
