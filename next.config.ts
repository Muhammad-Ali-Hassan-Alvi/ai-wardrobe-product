import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep native sharp out of the Turbopack graph so uploads/API routes don't crash on load
  serverExternalPackages: [
    "sharp",
    "@img/sharp-linux-x64",
    "@img/sharp-libvips-linux-x64",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
