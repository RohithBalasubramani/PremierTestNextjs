/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export", // Ensures Next.js exports as a static site
  basePath: isProd ? "/PremierTest" : "",
  assetPrefix: isProd ? "/PremierTest/" : "",
  trailingSlash: true, // Ensures every page is exported with a trailing slash
};

export default nextConfig;
