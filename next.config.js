/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/index.html',
        destination: '/dashboard',
      },
      {
        source: '/404.html',
        destination: '/dashboard',
      },
    ];
  },
};

module.exports = nextConfig;
