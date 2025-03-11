import { NextResponse } from "next/server";
import { getScenarioResults } from "../../../../../lib/server-utils";

// GET handler for a specific scenario
export async function GET(
	request: Request,
	context: { params: Promise<{ categoryId: string; scenarioId: string }> },
) {
	try {
		const params = await context.params;
		const { categoryId, scenarioId } = params;
		const scenarioResults = getScenarioResults(categoryId, scenarioId);

		if (!scenarioResults) {
			return NextResponse.json(
				{ error: "Scenario not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(scenarioResults, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch scenario results:", error);
		return NextResponse.json(
			{ error: "Failed to fetch scenario results" },
			{ status: 500 },
		);
	}
}
