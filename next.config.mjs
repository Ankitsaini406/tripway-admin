/** @type {import('next').NextConfig} */

import dotenv from "dotenv";

dotenv.config();

const nextConfig = {
    images: {
        domains: [
            'tripwayholidays.in',
        ],
    },
    env: {
        FTP_HOST: process.env.NEXT_FTP_HOST,
        FTP_USER: process.env.NEXT_FTP_HOST_USER,
        FTP_PASSWORD: process.env.NEXT_FTP_HOST_PASSWORD,
        FTP_PORT: process.env.NEXT_FTP_HOST_PORT,
    }
};

export default nextConfig;
