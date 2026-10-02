import type { NextConfig } from "next";

/**
 * Redirects for URLs a typical WordPress predecessor leaves behind
 * (default pages, feeds, admin and sitemap URLs). Each one is a permanent 301.
 */
const migrationRedirects: { source: string; destination: string }[] = [
  { source: "/register-now/", destination: "/free-profile-check/" },
  { source: "/hello-world/", destination: "/blog/" },
  { source: "/sample-page/", destination: "/" },
  { source: "/pricing/", destination: "/service/" },
  { source: "/category/:path*", destination: "/blog/" },
  { source: "/author/:path*", destination: "/blog/" },
  { source: "/feed/", destination: "/blog/" },
  { source: "/usa-visit-visa/", destination: "/visit-visas/#usa" },
  { source: "/uk-visit-visa/", destination: "/visit-visas/#uk" },
  { source: "/canada-visit-visa/", destination: "/visit-visas/#canada" },
  { source: "/australia-visit-visa/", destination: "/visit-visas/#australia" },
  { source: "/europe-visit-visa/", destination: "/visit-visas/#schengen" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/wp-sitemap-:rest.xml", destination: "/sitemap.xml" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/wp-admin/:path*", destination: "/" },
  { source: "/wp-login.php", destination: "/" },
];

/**
 * STATIC_EXPORT=1 (set by `npm run build:static`) writes plain HTML to /dist for any static host.
 * Static hosting has no server, so redirects, headers, image optimisation and /api/lead are left out.
 */
const STATIC_EXPORT = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(STATIC_EXPORT ? { output: "export" as const, distDir: "dist" } : {}),
  // GitHub Pages project sites live under /<repo>; the deploy workflow sets this.
  ...(process.env.NEXT_PUBLIC_BASE_PATH ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "") } : {}),
  trailingSlash: true,
  poweredByHeader: false,
  // build-static.mjs runs tsc itself before the export (with app/api in place), so skip the duplicate check here.
  typescript: { ignoreBuildErrors: STATIC_EXPORT },
  // Inline the (small, atomic) Tailwind CSS: removes a render-blocking request for first-time mobile visitors.
  experimental: { inlineCss: true },
  images: {
    ...(STATIC_EXPORT ? { loader: "custom" as const, loaderFile: "./lib/image-loader.ts" } : {}),
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  ...(STATIC_EXPORT ? {} : { redirects, headers }),
};

async function redirects() {
  return migrationRedirects.map((r) => ({ ...r, statusCode: 301 as const }));
}

async function headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ];
}

export default nextConfig;
