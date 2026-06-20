/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce consistent URL format
  trailingSlash: false,

  // Enable compression
  compress: true,

  // Redirect duplicate /teams/[id] → /team/[id]
  async redirects() {
    return [
      {
        source: '/teams/:id((?!$).*)',
        destination: '/team/:id',
        permanent: true,
      },
    ];
  },

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
      {
        source: '/api/rapid/:path*',
        destination: 'https://wc26-live-football-api.p.rapidapi.com/:path*',
      },
      {
        source: '/api/apisports/:path*',
        destination: 'https://v3.football.api-sports.io/:path*',
      },
    ];
  },
};

export default nextConfig;
