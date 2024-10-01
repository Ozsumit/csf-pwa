import withPWA from "next-pwa";

const config = {
  reactStrictMode: true,
  output: "export", // Injected property
};

const nextConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  sw: "/service-worker.ts",
})(config);

export default nextConfig;
