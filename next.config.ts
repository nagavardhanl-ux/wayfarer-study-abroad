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

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  // Inline the (small, atomic) Tailwind CSS: removes a render-blocking request for first-time mobile visitors.
  experimental: { inlineCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  async redirects() {
    return migrationRedirects.map((r) => ({ ...r, statusCode: 301 as const }));
  },
  async headers() {
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
  },
};

export default nextConfig;
