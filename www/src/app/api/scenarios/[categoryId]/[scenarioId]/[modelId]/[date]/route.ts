import { getSpecificResult } from "@/lib/server-utils";
import { NextResponse } from "next/server";

// GET handler for a specific result
export async function GET(
	request: Request,
	context: {
		params: Promise<{
			categoryId: string;
			scenarioId: string;
			modelId: string;
			date: string;
		}>;
	},
) {
	try {
		const params = await context.params;
		const { categoryId, scenarioId, modelId, date } = params;
		const result = getSpecificResult(categoryId, scenarioId, modelId, date);

		if (!result) {
			return NextResponse.json({ error: "Result not found" }, { status: 404 });
		}

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Failed to fetch specific result:", error);
		return NextResponse.json(
			{ error: "Failed to fetch specific result" },
			{ status: 500 },
		);
	}
}
