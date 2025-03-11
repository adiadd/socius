"use client";

import { extractModelResponseContent, formatDate } from "@/lib/utils";
import type { ScenarioResultCardProps } from "@/types/component-props";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScenarioResultCard({
	result,
	categoryId,
	scenarioId,
}: ScenarioResultCardProps) {
	if (!result) return null;
	const router = useRouter();

	// Extract the date from the timestamp
	const resultDate = formatDate(result.timestamp);

	// Extract relevant data
	const modelName = result.modelConfig.name;
	const provider = result.modelConfig.provider;
	const responseTime = (result.elapsedTimeMs / 1000).toFixed(2);

	// Extract a preview of the response (limited to 150 characters)
	const responseContent = extractModelResponseContent(result);
	const responsePreview =
		responseContent.length > 150
			? `${responseContent.substring(0, 150)}...`
			: responseContent;

	const resultUrl = `/scenarios/${categoryId}/${scenarioId}/${result.modelId}/${result.timestamp.split("T")[0]}`;

	const handleCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Prevent navigation if clicking on the link
		if ((e.target as HTMLElement).closest("a")) {
			return;
		}
		router.push(resultUrl);
	};

	return (
		<button
			type="button"
			className="border border-black dark:border-white p-4 hover:bg-accent/10 transition-colors cursor-pointer w-full text-left"
			onClick={handleCardClick}
			aria-label={`View ${modelName} response details`}
		>
			<div className="flex justify-between mb-2">
				<h4 className="font-medium">{modelName}</h4>
				<span className="text-sm text-muted-foreground">{provider}</span>
			</div>

			<div className="text-sm mb-4">
				<p className="text-muted-foreground">
					Run on {resultDate} • {responseTime}s
				</p>
			</div>

			<div className="mb-4">
				<p className="text-sm line-clamp-3">{responsePreview}</p>
			</div>

			<Link href={resultUrl}>View full response</Link>
		</button>
	);
}
