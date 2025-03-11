import { getAllResults, getAllScenarioResults } from "@/lib/server-utils";
import { NextResponse } from "next/server";

// GET handler for all scenarios
export async function GET() {
	try {
		const allResults = await getAllScenarioResults();
		return NextResponse.json(allResults, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch scenario results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch scenario results" },
			{ status: 500 },
		);
	}
}

// Generate static paths for scenarios
export async function generateStaticParams() {
	const resultsData = getAllResults();
	const paths: { categoryId: string; scenarioId: string }[] = [];

	for (const categoryId in resultsData) {
		for (const scenarioId in resultsData[categoryId]) {
			paths.push({ categoryId, scenarioId });
		}
	}

	return paths;
}
