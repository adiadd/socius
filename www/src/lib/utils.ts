import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Helper type definitions for scenario data
export interface ModelResult {
	modelId: string;
	modelConfig: {
		name: string;
		provider: string;
		version?: string;
		maxTokens?: number;
		temperature?: number;
	};
	promptPath: string;
	promptContent: {
		metadata: {
			title: string;
			tags: string[];
			difficulty: string;
			createdAt: string;
		};
		content: string;
	};
	response: any;
	timestamp: string;
	elapsedTimeMs: number;
}

export interface ScenarioResult {
	scenarioId: string;
	categoryId: string;
	modelResults: {
		[modelId: string]: {
			[date: string]: ModelResult;
		};
	};
}

// Format timestamp to a readable date
export function formatDate(timestamp: string): string {
	const date = new Date(timestamp);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

// Extract model response content based on provider
export function extractModelResponseContent(result: ModelResult): string {
	if (!result?.response) return '';

	if (result.modelConfig.provider === 'OpenAI') {
		return result.response.choices?.[0]?.message?.content || '';
	}

	if (result.modelConfig.provider === 'Anthropic') {
		const content = result.response.content;
		if (Array.isArray(content)) {
			return content.map(item => item.text).join('\n');
		}
		return content || '';
	}

	if (result.modelConfig.provider === 'Google') {
		return result.response.content || '';
	}

	// Default fallback
	return JSON.stringify(result.response);
}
