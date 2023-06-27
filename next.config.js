/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
