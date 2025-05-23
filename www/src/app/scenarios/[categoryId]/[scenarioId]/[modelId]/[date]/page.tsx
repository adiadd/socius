import { CollapsibleSection } from "@/components/collapsible-section";
import { getScenarioResult } from "@/lib/server-utils";
import { extractModelResponseContent, formatDate } from "@/lib/utils";
import type { ScenarioResultPageProps } from "@/types/pages";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

export async function generateMetadata({
	params,
}: ScenarioResultPageProps): Promise<Metadata> {
	const resolvedParams = await params;
	const { categoryId, scenarioId, modelId, date } = resolvedParams;
	const formattedScenario = scenarioId.split("-").join(" ");

	return {
		title: `${formattedScenario} / ${modelId} / ${date}`,
		description: `View the ${modelId} model's response to the ${formattedScenario} scenario.`,
	};
}

export default async function ScenarioResultPage({
	params,
}: ScenarioResultPageProps) {
	const resolvedParams = await params;
	const { categoryId, scenarioId, modelId, date } = resolvedParams;
	const result = await getScenarioResult(categoryId, scenarioId, modelId, date);

	if (!result) {
		notFound();
	}

	const formattedScenario = scenarioId.split("-").join(" ");
	const responseContent = extractModelResponseContent(result);
	const formattedDate = formatDate(result.timestamp);
	const responseTime = (result.elapsedTimeMs / 1000).toFixed(2);

	// Prepare the content for the prompt section
	const promptContent = (
		<div className="border border-black dark:border-white p-6 rounded-md bg-gray-50 dark:bg-gray-900 shadow-sm">
			<div
				className="prose prose-md dark:prose-invert max-w-none 
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 
                prose-pre:p-4 prose-pre:rounded-md 
                prose-code:text-red-500 dark:prose-code:text-red-400"
			>
				<ReactMarkdown
					rehypePlugins={[rehypeRaw, rehypeHighlight]}
					key="model-prompt-markdown"
				>
					{result.promptContent.content}
				</ReactMarkdown>
			</div>
		</div>
	);

	// Prepare the content for the response section
	const responseContentElement = (
		<div className="border border-black dark:border-white p-6 rounded-md bg-gray-50 dark:bg-gray-900 shadow-sm">
			<div
				className="prose prose-md dark:prose-invert max-w-none 
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 
                prose-pre:p-4 prose-pre:rounded-md 
                prose-code:text-blue-500 dark:prose-code:text-blue-400"
			>
				<ReactMarkdown
					rehypePlugins={[rehypeRaw, rehypeHighlight]}
					key="model-response-markdown"
				>
					{responseContent}
				</ReactMarkdown>
			</div>
		</div>
	);

	// Prepare the content for the model config section
	const modelConfigContent = (
		<div className="border border-black dark:border-white p-4 rounded-md bg-gray-50 dark:bg-gray-900 shadow-sm">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<p className="text-sm text-muted-foreground">Provider</p>
					<p className="font-medium">{result.modelConfig.provider}</p>
				</div>
				<div>
					<p className="text-sm text-muted-foreground">Version</p>
					<p className="font-medium">{result.modelConfig.version || "N/A"}</p>
				</div>
				<div>
					<p className="text-sm text-muted-foreground">Max Tokens</p>
					<p className="font-medium">{result.modelConfig.maxTokens || "N/A"}</p>
				</div>
				<div>
					<p className="text-sm text-muted-foreground">Temperature</p>
					<p className="font-medium">
						{result.modelConfig.temperature || "N/A"}
					</p>
				</div>
			</div>
		</div>
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
					{result.promptContent.metadata.title}
				</h1>
				<div className="flex flex-wrap gap-2 mb-4">
					{result.promptContent.metadata.tags.map((tag: string) => (
						<span
							key={tag}
							className="bg-accent/20 px-2 py-1 text-xs rounded-md"
						>
							{tag}
						</span>
					))}
					<span className="bg-accent/30 px-2 py-1 text-xs rounded-md">
						{result.promptContent.metadata.difficulty}
					</span>
				</div>
				<p className="text-muted-foreground text-sm">
					{result.modelConfig.name} ({result.modelId}) • {formattedDate} •{" "}
					{responseTime}s
				</p>
			</div>

			{/* Content section - now vertical layout */}
			<div className="flex flex-col gap-8">
				{/* Prompt section */}
				<CollapsibleSection title="Prompt" defaultOpen={false}>
					<div key="model-prompt-container">{promptContent}</div>
				</CollapsibleSection>

				{/* Response section */}
				<CollapsibleSection title="Response" defaultOpen={true}>
					<div key="model-response-container">{responseContentElement}</div>
				</CollapsibleSection>
			</div>

			{/* Model config section */}
			<div className="mt-8">
				<h2 className="text-lg font-medium mb-4">Model Configuration</h2>
				{modelConfigContent}
			</div>
		</div>
	);
}
