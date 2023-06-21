/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["all-to-delicious.s3.ap-northeast-2.amazonaws.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
