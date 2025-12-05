/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      // Allow all images during development (not recommended for production)
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              protocol: 'https',
              hostname: '**',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
}

export default nextConfig