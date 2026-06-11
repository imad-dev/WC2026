/** @type {import('next').NextConfig} */
const nextConfig = {
  // Replicate Vite dev-server proxy behavior via Next.js rewrites
  async rewrites() {
    return [
      {
        source: '/api/openfootball/:path*',
        destination:
          'https://raw.githubusercontent.com/openfootball/football.json/master/2025-26/:path*',
      },
      {
        source: '/api/football-data/:path*',
        destination: 'https://api.football-data.org/v4/:path*',
      },
      {
        source: '/api/wc2026/:path*',
        destination: 'https://api.worldcupapi.com/:path*',
      },
    ];
  },
};

export default nextConfig;
