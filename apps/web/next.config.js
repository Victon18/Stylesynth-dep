/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],

  // REQUIRED for Prisma in a Turborepo on Vercel
  experimental: {
    serverComponentsExternalPackages: ["@repo/db"],
  },

  // Your Flask rewrites preserved
  rewrites: async () => {
    return [
      {
        source: "/flask/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/flask/:path*"
            : "/flask/",
      },
    ];
  },
};

export default nextConfig;

