/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['developer.spotify.com', 'mosaic.scdn.co', 'i.scdn.co']
  }
}

module.exports = nextConfig
