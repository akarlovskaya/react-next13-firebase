/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            pathname: '/**', // Match all dynamic paths under this hostname
        },
        ],
    }
};

export default nextConfig;