#!/usr/bin/env node

/**
 * This script loads all results from the src/results directory and generates
 * a JavaScript module that exports the data. This is run during the build step
 * to ensure that the latest results are included in the build.
 */

import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the results directory
const resultsDir = join(__dirname, "../../src/results");

// Path to the output directory
const outputDir = join(__dirname, "../src/generated");

// Ensure the output directory exists
if (!existsSync(outputDir)) {
	mkdirSync(outputDir, { recursive: true });
}

// Function to recursively traverse directories and collect JSON files
function collectResults(categoryId, scenarioId, modelId) {
	const modelPath = join(resultsDir, categoryId, scenarioId, modelId);
	const results = {};

	if (!existsSync(modelPath)) {
		return results;
	}

	const files = readdirSync(modelPath).filter((file) => file.endsWith(".json"));

	for (const file of files) {
		const date = file.replace(".json", "");
		const filePath = join(modelPath, file);
		const fileContent = readFileSync(filePath, "utf8");

		try {
			const result = JSON.parse(fileContent);
			results[date] = result;
		} catch (error) {
			console.error(`Error parsing ${filePath}:`, error);
		}
	}

	return results;
}

// Function to collect all results
function getAllResults() {
	const results = {};

	// Check if results directory exists
	if (!existsSync(resultsDir)) {
		console.warn(`Results directory not found: ${resultsDir}`);
		return results;
	}

	// Get all categories
	const categories = readdirSync(resultsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const categoryId of categories) {
		results[categoryId] = {};
		const categoryPath = join(resultsDir, categoryId);

		// Get all scenarios in this category
		const scenarios = readdirSync(categoryPath, { withFileTypes: true })
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);

		for (const scenarioId of scenarios) {
			const scenarioResult = {
				scenarioId,
				categoryId,
				modelResults: {},
			};

			const scenarioPath = join(categoryPath, scenarioId);

			// Get all models for this scenario
			const models = readdirSync(scenarioPath, { withFileTypes: true })
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name);

			for (const modelId of models) {
				scenarioResult.modelResults[modelId] = collectResults(
					categoryId,
					scenarioId,
					modelId,
				);
			}

			results[categoryId][scenarioId] = scenarioResult;
		}
	}

	return results;
}

// Collect all the results
const allResults = getAllResults();

// Generate the output file
const outputPath = join(outputDir, "scenario-results.js");
const outputContent = `// THIS FILE IS GENERATED. DO NOT EDIT DIRECTLY.
// Generated on: ${new Date().toISOString()}

export const scenarioResults = ${JSON.stringify(allResults, null, 2)};
`;

writeFileSync(outputPath, outputContent);
console.log(`Generated scenario results at: ${outputPath}`);
