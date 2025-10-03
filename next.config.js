/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    // Only rewrite in development - in production, requests go directly to Vercel serverless functions
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/chat/:path*",
          destination: "http://127.0.0.1:8000/api/chat/:path*",
        },
        {
          source: "/docs",
          destination: "http://127.0.0.1:8000/docs",
        },
        {
          source: "/openapi.json",
          destination: "http://127.0.0.1:8000/openapi.json",
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
