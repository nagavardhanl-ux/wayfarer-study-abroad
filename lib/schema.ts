import type { Branch } from "./content";
import { BRAND, FOUNDED, LEGAL_NAME, SOCIAL_LINKS, absoluteUrl } from "./site";

type Json = Record<string, unknown>;

export function organizationSchema(branches: Branch[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": absoluteUrl("/#organization"),
    name: BRAND,
    legalName: LEGAL_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/apple-icon"),
    foundingDate: String(FOUNDED),
    ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS.map(([, href]) => href) } : {}),
    department: branches.map((b) => ({ "@id": absoluteUrl(`/branches/${b.slug}/#localbusiness`) })),
  };
}

export function localBusinessSchema(b: Branch, rating?: { rating: number; reviewCount: number }): Json {
  const data: Json = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    additionalType: "https://schema.org/LocalBusiness",
    "@id": absoluteUrl(`/branches/${b.slug}/#localbusiness`),
    name: `${BRAND} ${b.name}`,
    url: absoluteUrl(`/branches/${b.slug}/`),
    telephone: b.phone,
    parentOrganization: { "@id": absoluteUrl("/#organization") },
    address: {
      "@type": "PostalAddress",
      streetAddress: b.streetAddress,
      addressLocality: b.locality,
      addressRegion: b.state,
      postalCode: b.postalCode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng },
    hasMap: b.mapLink,
  };
  if (b.hours.length) {
    data.openingHoursSpecification = b.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.split(",").map((d) => d.trim()),
      opens: h.opens,
      closes: h.closes,
    }));
  }
  if (b.googleBusinessUrl) data.sameAs = [b.googleBusinessUrl];
  if (rating && rating.rating > 0 && rating.reviewCount > 0) {
    data.aggregateRating = { "@type": "AggregateRating", ratingValue: rating.rating, reviewCount: rating.reviewCount };
  }
  return data;
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: absoluteUrl(i.href),
    })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; published: string; modified?: string; image?: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: absoluteUrl(a.path),
    datePublished: a.published,
    dateModified: a.modified ?? a.published,
    author: { "@type": "Organization", name: BRAND, url: absoluteUrl("/") },
    publisher: { "@id": absoluteUrl("/#organization") },
    ...(a.image ? { image: absoluteUrl(a.image) } : {}),
  };
}

export function courseSchema(c: { name: string; description: string; path: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.path),
    provider: { "@type": "EducationalOrganization", name: BRAND, sameAs: absoluteUrl("/") },
    hasCourseInstance: [
      { "@type": "CourseInstance", courseMode: "online" },
      { "@type": "CourseInstance", courseMode: "onsite", location: "Wayfarer branches in Bengaluru, Chennai, Pune and Kochi" },
    ],
  };
}
