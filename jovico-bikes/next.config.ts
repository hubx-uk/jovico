import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**.jovicoworld.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
        formats: ['image/avif', 'image/webp'],
    },
    experimental: {
        serverActions: {
            allowedOrigins: ['localhost:3000', 'jovicoworld.com'],
        },
    },
}

export default nextConfig
