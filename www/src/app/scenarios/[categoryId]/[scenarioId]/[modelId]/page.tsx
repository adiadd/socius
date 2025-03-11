import { getScenarioResults } from "@/lib/server-utils";
import { formatDate } from "@/lib/utils";
import type { ModelResultsPageProps } from "@/types/pages";
import type { ModelResult } from "@/types/scenario-types";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: ModelResultsPageProps): Promise<Metadata> {
	const resolvedParams = await params;
	const { categoryId, scenarioId, modelId } = resolvedParams;
	const formattedScenario = scenarioId.split("-").join(" ");

	return {
		title: `${modelId} / ${formattedScenario} / scenarios`,
		description: `View all ${modelId} responses for the ${formattedScenario} scenario.`,
	};
}

export default async function ModelResultsPage({
	params,
}: ModelResultsPageProps) {
	const resolvedParams = await params;
	const { categoryId, scenarioId, modelId } = resolvedParams;
	const scenarioResult = await getScenarioResults(categoryId, scenarioId);

	if (!scenarioResult) {
		notFound();
	}

	// Type check for modelResults
	if (
		!scenarioResult.modelResults ||
		typeof scenarioResult.modelResults !== "object"
	) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<p>No model results available</p>
			</div>
		);
	}

	const modelResults = scenarioResult.modelResults[modelId] as Record<
		string,
		ModelResult
	>;
	if (!modelResults || Object.keys(modelResults).length === 0) {
		notFound();
	}

	const formattedScenario = scenarioId.split("-").join(" ");

	// Get model name from the first result
	const firstResult = Object.values(modelResults)[0] || {};
	const modelName = firstResult.modelConfig?.name || modelId;

	// Sort dates in descending order
	const sortedDates = Object.keys(modelResults).sort((a, b) =>
		b.localeCompare(a),
	);

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* Breadcrumb navigation */}
			<div className="mb-8">
				<Link
					href={`/scenarios/${categoryId}/${scenarioId}`}
					className="inline-flex items-center text-sm hover:underline"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to {formattedScenario}
				</Link>
			</div>

			{/* Header section */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold mb-2">
					{modelName} ({modelId})
				</h1>
				<p className="text-muted-foreground">
					All responses for the {formattedScenario} scenario
				</p>
			</div>

			{/* Results listing */}
			<div className="grid grid-cols-1 gap-6">
				{sortedDates.map((date) => {
					const result = modelResults[date] || {};
					const formattedDate = formatDate(result.timestamp || date);
					const responseTime = ((result.elapsedTimeMs || 0) / 1000).toFixed(2);

					return (
						<Link
							key={date}
							href={`/scenarios/${categoryId}/${scenarioId}/${modelId}/${date}`}
							className="border border-black dark:border-white p-6 hover:bg-accent/10 transition-colors"
						>
							<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
								<h2 className="text-lg font-medium">{formattedDate}</h2>
								<p className="text-sm text-muted-foreground">
									{responseTime}s response time
								</p>
							</div>

							<div className="flex flex-wrap gap-2 mb-4">
								{(result.promptContent?.metadata?.tags || []).map(
									(tag: string) => (
										<span
											key={tag}
											className="bg-accent/20 px-2 py-1 text-xs rounded-md"
										>
											{tag}
										</span>
									),
								)}
								{result.promptContent?.metadata?.difficulty && (
									<span className="bg-accent/30 px-2 py-1 text-xs rounded-md">
										{result.promptContent.metadata.difficulty}
									</span>
								)}
							</div>

							<div className="text-sm text-muted-foreground">
								<p>View full response →</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
