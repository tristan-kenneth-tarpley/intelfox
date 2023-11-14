/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
