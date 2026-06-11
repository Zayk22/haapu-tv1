/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
      },
      {
        protocol: "https",
        hostname: "watch.haaputv.com",  // ← ADD THIS for your posters
      },
      {
        protocol: "http",
        hostname: "localhost",  // Keep for local development
      },
    ],
  },
};

export default nextConfig;