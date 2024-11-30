/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avatars.githubusercontent.com'], // For GitHub avatars
  },
  // Preserve our existing docs directory structure
  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: '/api/docs/:path*',
      },
      {
        source: '/blog/:path*',
        destination: '/api/blog/:path*',
      },
      {
        source: '/plugins/:path*',
        destination: '/api/plugins/:path*',
      },
    ]
  },
}

module.exports = nextConfig 