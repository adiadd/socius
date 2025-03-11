import ScenariosPage from "@/components/scenarios-page";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `scenarios / ${siteConfig.name}`,
	description:
		"Explore anthropocentric scenarios designed to evaluate AI systems on their understanding of human values and ethical reasoning.",
};

export default function Scenarios() {
	return <ScenariosPage />;
}
