import { ThemeToggle } from "@/components/theme-toggle";
import { BrainCircuit } from "lucide-react";

export default function HomePage() {
	return (
		<>
			{/* header section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<BrainCircuit className="h-6 w-6" />
						<h1 className="text-xl">anthrobench</h1>
					</div>
					<ThemeToggle />
				</div>
				<p className="mt-2 text-muted-foreground">
					anthropocentric benchmarks for AI
				</p>
			</div>

			{/* mission section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex">
					<div className="w-1/4 pr-4">
						<p className="text-secondary font-medium">mission</p>
					</div>
					<div className="w-3/4">
						<p>
							to advance ai evaluation by focusing on humanity's challenges,
							creating benchmarks that assess ai systems' ability to think
							critically, ethically, and collaboratively when addressing
							real-world human issues.
						</p>
					</div>
				</div>
			</div>

			{/* philosophy section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex">
					<div className="w-1/4 pr-4">
						<p className="text-secondary font-medium">philosophy</p>
					</div>
					<div className="w-3/4">
						<p>
							moving beyond traditional ai metrics to evaluate ai thinking when
							solving complex human challenges.
						</p>
						<ul className="list-disc pl-5 mt-4 space-y-2">
							<li>human-centered technology</li>
							<li>ethical innovation</li>
							<li>collaborative progress</li>
							<li>global impact</li>
						</ul>
					</div>
				</div>
			</div>

			{/* approach section */}
			<div className="border-b border-black dark:border-white p-6">
				<div className="flex">
					<div className="w-1/4 pr-4">
						<p className="text-secondary font-medium">approach</p>
					</div>
					<div className="w-3/4">
						<p>
							anthrobench offers evaluation methodologies that measure what
							truly matters: ai's capacity to understand, respond to, and help
							resolve complex human challenges with nuance, empathy, and ethical
							consideration.
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
			<div className="p-6 flex justify-between text-muted-foreground">
				<div>
					<p>version: beta</p>
				</div>
				<div>
					<p>updated: {new Date().toISOString().split("T")[0]}</p>
				</div>
			</div>
		</>
	);
}
