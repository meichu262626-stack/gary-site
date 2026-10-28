// GITHUB_PAGES=1 時輸出成純靜態檔，放在 https://<帳號>.github.io/gary-site/ 底下
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? "/gary-site" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(pages && { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
