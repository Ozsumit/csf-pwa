// next.config.mjs
import withPWA from 'next-pwa';

const config = {
  reactStrictMode: true,
};

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: '/service-worker.ts',
})(config);

export default nextConfig;