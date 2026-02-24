import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER;

    return {
        output: isDev ? undefined : "export",
        images: { unoptimized: true },
        reactStrictMode: true,
        trailingSlash: true,
        transpilePackages: ["@compass/ui"],
        experimental: { externalDir: true }
    };
};

export default nextConfig;
