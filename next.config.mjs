/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'trakiotsolutions.blob.core.windows.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'lsinterviews.blob.core.windows.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'neuralwavesystems.com/api',
        port: '',
      },
    ],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
};

export default nextConfig;
