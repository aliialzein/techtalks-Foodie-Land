import type { NextConfig } from "next";

// The backend runs as a separate Next.js app. We forward same-origin `/api/*`
// requests to it so the browser never makes a cross-origin call (no CORS), which
// matches how the existing auth pages already fetch `/api/auth/*`.
// Override the target with the BACKEND_URL env var (defaults to localhost:3001).
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
