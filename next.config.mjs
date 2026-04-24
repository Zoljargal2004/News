/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
