import type { Metadata, Viewport } from "next";
import { Archivo, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader, SkipLink } from "@/components/SiteHeader";
import { StickyContactBar } from "@/components/StickyContactBar";
import { StickyPass } from "@/components/StickyPass";
import { asset } from "@/lib/asset";
import { getBranches, getCountries } from "@/lib/content";
import { organizationSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Arial Narrow", "system-ui", "sans-serif"],
});

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
  display: "swap",
  // Body text paints immediately in the size-matched system fallback; Noto swaps in when loaded.
  preload: false,
  fallback: ["system-ui", "Roboto", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wayfarer | Study abroad consultants in Bengaluru, Chennai, Pune and Kochi",
    template: "%s | Wayfarer",
  },
  description:
    "Admission, education loan and visa support for students in South and West India. Four branches: Bengaluru, Chennai, Pune and Kochi. Since 2011.",
  openGraph: {
    siteName: "Wayfarer",
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: asset("/icon.png"), type: "image/png", sizes: "64x64" }],
    apple: [{ url: asset("/apple-icon.png"), sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#124477",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const branches = getBranches();
  return (
    <html lang="en-IN" className={`${archivo.variable} ${noto.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <StickyContactBar
          branches={branches.map(({ slug, name, city, phone, phoneDisplay, whatsapp }) => ({ slug, name, city, phone, phoneDisplay, whatsapp }))}
        />
        <StickyPass
          destinations={getCountries().map(({ slug, name, code }) => ({ slug, name, code }))}
          branches={branches.map(({ slug, city, cityCode, name }) => ({ slug, city, cityCode, name }))}
        />
        <JsonLd data={organizationSchema(branches)} />
        <Analytics />
      </body>
    </html>
  );
}
