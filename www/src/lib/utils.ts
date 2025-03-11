import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ModelResult } from "../types/scenario-types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Format timestamp to a readable date
export function formatDate(timestamp: string): string {
	const date = new Date(timestamp);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

// Extract model response content based on provider
export function extractModelResponseContent(result: ModelResult): string {
	if (!result?.response) return "";

	if (result.modelConfig.provider === "OpenAI") {
		return result.response.choices?.[0]?.message?.content || "";
	}

	if (result.modelConfig.provider === "Anthropic") {
		const content = result.response.content;
		if (Array.isArray(content)) {
			return content.map((item) => item.text).join("\n");
		}
		return typeof content === "string" ? content : "";
	}

	if (result.modelConfig.provider === "Google") {
		return typeof result.response.content === "string"
			? result.response.content
			: "";
	}

	// Default fallback
	return JSON.stringify(result.response);
}
