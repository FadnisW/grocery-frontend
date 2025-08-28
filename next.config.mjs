/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'grocery-backend-rhiu.onrender.com',
                port: '',
                pathname: '/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'grocery-frontend-n72vixfbo-waqars-projects-1ec04b0c.vercel.app',
                port: '',
                pathname: '/**',
            }
        ]
    },
    reactStrictMode:false
};

export default nextConfig;
