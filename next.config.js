/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        // These run BEFORE checking for pages/API routes
        {
          source: "/api/chat",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/api/chat"
              : "/api/chat",
        },
        {
          source: "/api/intakes/analyze",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/api/intakes/analyze"
              : "/api/intakes/analyze",
        },
      ],
      afterFiles: [
        // These run AFTER checking for pages/API routes
        {
          source: "/docs",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/docs"
              : "/api/docs",
        },
        {
          source: "/openapi.json",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/openapi.json"
              : "/api/openapi.json",
        },
      ],
    };
  },
};

module.exports = nextConfig;
