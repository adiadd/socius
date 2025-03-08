# socius SEO Guidelines

This document outlines the SEO best practices for the socius repository, with a focus on what to do when adding new pages.

## When Adding a New Page

### 1. Page Metadata

For pages with unique metadata requirements, create a metadata object using the `generateMetadata` function:

```tsx
// src/app/your-new-page/page.tsx
import { Metadata } from "next";
import { siteConfig } from "../../config/site";

export const generateMetadata = (): Metadata => {
  const title = "Your Page Title / " + siteConfig.name;
  // Use the long description for SEO
  const description = siteConfig.description.long;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/your-new-page`,
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
    alternates: {
      canonical: `${siteConfig.url}/your-new-page`,
    },
  };
};
```

### 2. Description Usage

The site configuration contains two descriptions:
- `siteConfig.description.short` - Use for UI elements, cards, and places where space is limited
- `siteConfig.description.long` - Use for SEO metadata, structured data, and anywhere comprehensive information is beneficial

Example usage:

```tsx
// For UI elements (short):
<p className="tagline">{siteConfig.description.short}</p>

// For SEO metadata (long):
<meta name="description" content={siteConfig.description.long} />
```

### 3. Update the Sitemap

Add your new page to the sitemap.ts file:

```tsx
// src/app/sitemap.ts
// Add to the routes array
const routes = [
  {
    url: url,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  },
  {
    url: `${url}/your-new-page`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  },
  // Other routes...
];
```

### 4. Add Structured Data (if applicable)

If your page requires specific structured data:

1. Create a new component in `src/components/schema/your-new-schema.tsx`
2. Use the Next.js Script component with the JSON-LD pattern
3. Use the long description in the structured data
4. Import and use this component in your page component

Example:

```tsx
// In your schema component
import Script from "next/script";
import { siteConfig } from "../../config/site";

export function YourNewSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage", // Or other appropriate type
    "name": "Your Page Title",
    "description": siteConfig.description.long,
    // Other schema properties...
  };

  const jsonLd = JSON.stringify(structuredData, null, 2);

  return (
    <Script
      id="your-schema-id"
      type="application/ld+json"
      strategy="afterInteractive"
    >{`${jsonLd}`}</Script>
  );
}

// In your page component
import { YourNewSchema } from "../components/schema/your-new-schema";

export default function YourPage() {
  return (
    <>
      <YourNewSchema />
      {/* Page content */}
    </>
  );
}
```

## SEO Best Practices for This Repository

### Keywords

- Use keywords from `siteConfig.keywords` in your content
- Focus on naturally incorporating keywords like "ai benchmarking", "ethical reasoning", "human-centered ai", etc.

### Images

- Always use semantic alt text that describes the image content
- Use the Next.js Image component for optimization
- For critical images, include them in OpenGraph metadata

### Internal Linking

- Create meaningful internal links between related pages
- Use descriptive anchor text that includes relevant keywords

### Content Structure

- Use proper heading hierarchy (h1, h2, h3)
- Include a single h1 tag per page
- Keep URLs clean and descriptive
- Format content for readability with short paragraphs and bullet points

### Performance

- Keep JS bundle sizes small for faster page loads
- Use the `next/script` component with appropriate strategies for any third-party scripts

## Monitoring

After adding new pages:
- Test in Google's Mobile-Friendly Test
- Test in Google's Rich Results Test for structured data validation
- Monitor Core Web Vitals in Google Search Console 