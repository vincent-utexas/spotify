/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.spotify.com'
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com'
      },
      {
        protocol: 'https',
        hostname: '**.scdn.co'
      }
    ],
  }
}

module.exports = {
  distDir: 'build',
}
