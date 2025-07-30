/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable hot reload in Docker
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['node_modules']
      }
    }
    return config
  },
  // For Docker development
  experimental: {
    outputFileTracingRoot: undefined,
  }
}

module.exports = nextConfig
