const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
  disable: false,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});

console.log("Next.js PWA Config Loaded ✅");

module.exports = nextConfig;
