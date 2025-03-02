import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import type React from "react";
import { ThemeProvider } from "../components/theme-provider";
import { siteConfig } from "../config/site";
import "./globals.css";

const spaceMono = Space_Mono({
	weight: ["400", "700"],
	subsets: ["latin"],
	variable: "--font-space-mono",
});

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description.long,
	metadataBase: new URL(siteConfig.url),
	keywords: siteConfig.keywords,
	authors: [{ name: siteConfig.creator.name, url: siteConfig.creator.url }],
	creator: siteConfig.creator.name,
	publisher: siteConfig.creator.name,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	icons: [{ rel: "icon", url: "/favicon.ico" }],
	manifest: "/manifest.json",
	appleWebApp: {
		title: siteConfig.name,
		statusBarStyle: "default",
		capable: true,
	},
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		url: siteConfig.url,
		title: siteConfig.name,
		description: siteConfig.description.short,
		siteName: siteConfig.name,
		images: [{ url: "/opengraph-image.png" }],
	},
	twitter: {
		card: "summary_large_image",
		title: siteConfig.name,
		description: siteConfig.description.short,
		creator: siteConfig.creator.twitter,
		site: siteConfig.creator.twitter,
		images: [{ url: "/twitter-image.png" }],
	},
	alternates: {
		canonical: siteConfig.url,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${spaceMono.variable}`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="min-h-screen bg-background text-black dark:text-white font-mono text-sm">
						<div className="max-w-4xl mx-auto p-4">
							<div className="border border-black dark:border-white">
								{children}
							</div>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
