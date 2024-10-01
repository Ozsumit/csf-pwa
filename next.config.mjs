import withPWA from "next-pwa";

const config = {
  reactStrictMode: true,
  output: "export",
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Remove the sw property for now
  // sw: "/service-worker.ts",
})(config);

export default nextConfig;
