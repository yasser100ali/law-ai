/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    // In development, proxy Python routes to local server
    if (process.env.NODE_ENV === "development") {
      return {
        beforeFiles: [
          {
            source: "/api/chat",
            destination: "http://127.0.0.1:8000/api/chat",
          },
          {
            source: "/api/intakes/analyze",
            destination: "http://127.0.0.1:8000/api/intakes/analyze",
          },
        ],
        afterFiles: [
          {
            source: "/docs",
            destination: "http://127.0.0.1:8000/docs",
          },
          {
            source: "/openapi.json",
            destination: "http://127.0.0.1:8000/openapi.json",
          },
        ],
      };
    }
    
    // In production, let Vercel handle Python routes automatically
    return {
      afterFiles: [],
    };
  },
};

module.exports = nextConfig;
