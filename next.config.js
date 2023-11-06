/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
      },
    ],
  },
  // todo remove when inbox 0
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
