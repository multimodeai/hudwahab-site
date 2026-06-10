/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/nmcore/**",
      },
    ],
  },
  async rewrites() {
    // Clean URL for the static Token Burn dashboard. The page's <base href>
    // keeps its relative assets (app.js/styles.css/data.json) resolving correctly.
    return [{ source: "/token-burn", destination: "/token-burn/index.html" }];
  },
};

export default nextConfig;
