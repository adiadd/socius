import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const url = siteConfig.url;

	// Define the main pages of the site
	const routes = [
		{
			url: url,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1.0,
		},
		// Add other main routes as they are developed
	];

	return routes;
}
