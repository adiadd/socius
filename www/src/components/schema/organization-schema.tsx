import { siteConfig } from "@/config/site";
import Script from "next/script";

export function OrganizationJsonLd() {
	// Create JSON-LD structured data
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteConfig.name,
		description: siteConfig.description.long,
		url: siteConfig.url,
		logo: `${siteConfig.url}/opengraph-image.png`,
		sameAs: siteConfig.socials.map((social) => social.url),
		founder: {
			"@type": "Person",
			name: siteConfig.creator.name,
		},
		knowsAbout: [
			"AI Benchmarking",
			"Ethical AI",
			"Human-Centered AI",
			"Critical Thinking Assessment",
			"Ethical Reasoning Evaluation",
		],
	};

	// Create JSON string with proper formatting
	const jsonLd = JSON.stringify(structuredData, null, 2);

	return (
		<Script
			id="organization-schema"
			type="application/ld+json"
			strategy="afterInteractive"
		>{`${jsonLd}`}</Script>
	);
}
