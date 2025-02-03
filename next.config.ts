import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pfxssdkuiyqfhwyhkykk.supabase.co",
      },
    ],
  },
};

export default nextConfig;
