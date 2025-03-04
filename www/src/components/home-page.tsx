import { BrainCircuit, Github, Twitter } from "lucide-react";
import { siteConfig } from "../config/site";
import { OrganizationJsonLd } from "./schema/organization-schema";
import { ThemeToggle } from "./theme-toggle";
import { CustomLink } from "./ui/custom-link";

export default function HomePage() {
	// Update this value when the page changes
	// Use explicit year, month (0-based), day parameters to avoid timezone issues
	const lastUpdated = new Date(2025, 2, 1); // March is month 2 (0-based index)

	const formattedDate = new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(lastUpdated);

	const iconComponents = {
		github: Github,
		twitter: Twitter,
	};

	return (
		<>
			{/* Add Schema.org structured data */}
			<OrganizationJsonLd />

			{/* header section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<BrainCircuit className="h-6 w-6" />
						<h1 className="text-xl">socius</h1>
					</div>
					<ThemeToggle />
				</div>
				<p className="mt-2 text-muted-foreground">
					<CustomLink
						href="https://www.merriam-webster.com/dictionary/anthropocentric"
						external={true}
						showExternalIndicator={true}
					>
						anthropocentric
					</CustomLink>{" "}
					scenarios for ai
				</p>
			</div>

			{/* mission section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/4 mb-2 md:mb-0 md:pr-4">
						<p className="text-secondary font-medium">mission</p>
					</div>
					<div className="w-full md:w-3/4">
						<p>
							to further ai evaluations by focusing on how it makes decisions to
							solve real world human issues; for the betterment of society
						</p>
					</div>
				</div>
			</div>

			{/* philosophy section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/4 mb-2 md:mb-0 md:pr-4">
						<p className="text-secondary font-medium">philosophy</p>
					</div>
					<div className="w-full md:w-3/4">
						<p>
							create novel benchmarks that help humans evaluate ai when asked to
							solve complex human challenges
						</p>
						<ul className="list-disc pl-5 mt-4 space-y-2">
							<li>humanity-centered topics</li>
							<li>ethical decision making</li>
							<li>societal implications</li>
							<li>future focused</li>
						</ul>
					</div>
				</div>
			</div>

			{/* approach section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex flex-col md:flex-row">
					<div className="w-full md:w-1/4 mb-2 md:mb-0 md:pr-4">
						<p className="text-secondary font-medium">approach</p>
					</div>
					<div className="w-full md:w-3/4">
						<p>
							offer evaluation methods that measure different angles of ai's
							capacity to understand, respond to, and help address intricate
							societal matters with nuance, empathy, and ethical consideration
						</p>
					</div>
				</div>
			</div>

			{/* features section */}
			<div className="border-b border-black dark:border-white">
				<div className="grid grid-cols-2">
					<div className="border-r border-black dark:border-white p-6">
						<p className="text-secondary font-medium mb-2">
							• critical thinking
						</p>
						<p>
							evaluating ai's ability to analyze complex problems and develop
							nuanced solutions
						</p>
					</div>
					<div className="p-6">
						<p className="text-secondary font-medium mb-2">
							• ethical reasoning
						</p>
						<p>
							assessing how ai systems navigate moral dilemmas and ethical
							considerations
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 border-t border-black dark:border-white">
					<div className="border-r border-black dark:border-white p-6">
						<p className="text-secondary font-medium mb-2">
							• collaborative problem-solving
						</p>
						<p>
							measuring ai's effectiveness in working with humans to address
							challenges
						</p>
					</div>
					<div className="p-6">
						<p className="text-secondary font-medium mb-2">
							• cultural awareness
						</p>
						<p>
							evaluating ai's understanding of diverse cultural contexts and
							perspectives
						</p>
					</div>
				</div>
			</div>

			{/* footer section */}
			<div className="p-6 grid grid-cols-3 items-center text-muted-foreground">
				<div className="text-left">
					<p>version: pre-alpha</p>
				</div>
				<div className="flex justify-center gap-4">
					{siteConfig.socials.map((social) => {
						const IconComponent =
							iconComponents[social.icon as keyof typeof iconComponents];
						return (
							<CustomLink
								key={social.name}
								href={social.url}
								external={true}
								showExternalIndicator={false}
								aria-label={social.name}
							>
								{IconComponent && <IconComponent className="h-5 w-5" />}
							</CustomLink>
						);
					})}
				</div>
				<div className="text-center md:text-right">
					<p>updated: {formattedDate}</p>
				</div>
			</div>
		</>
	);
}
