#!/usr/bin/env node

/**
 * This script loads all results from the src/results directory and generates
 * a JavaScript module that exports the data. This is run during the build step
 * to ensure that the latest results are included in the build.
 */

const fs = require('fs');
const path = require('path');

// Path to the results directory
const resultsDir = path.join(__dirname, '../../src/results');

// Path to the output directory
const outputDir = path.join(__dirname, '../src/generated');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to recursively traverse directories and collect JSON files
function collectResults(categoryId, scenarioId, modelId) {
    const modelPath = path.join(resultsDir, categoryId, scenarioId, modelId);
    const results = {};

    if (!fs.existsSync(modelPath)) {
        return results;
    }

    const files = fs.readdirSync(modelPath).filter(file => file.endsWith('.json'));

    for (const file of files) {
        const date = file.replace('.json', '');
        const filePath = path.join(modelPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

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

    // Get all categories
    const categories = fs.readdirSync(resultsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const categoryId of categories) {
        results[categoryId] = {};
        const categoryPath = path.join(resultsDir, categoryId);

        // Get all scenarios in this category
        const scenarios = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const scenarioId of scenarios) {
            const scenarioResult = {
                scenarioId,
                categoryId,
                modelResults: {}
            };

            const scenarioPath = path.join(categoryPath, scenarioId);

            // Get all models for this scenario
            const models = fs.readdirSync(scenarioPath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const modelId of models) {
                scenarioResult.modelResults[modelId] = collectResults(categoryId, scenarioId, modelId);
            }

            results[categoryId][scenarioId] = scenarioResult;
        }
    }

    return results;
}

// Collect all the results
const allResults = getAllResults();

// Generate the output file
const outputPath = path.join(outputDir, 'scenario-results.js');
const outputContent = `// THIS FILE IS GENERATED. DO NOT EDIT DIRECTLY.
// Generated on: ${new Date().toISOString()}

export const scenarioResults = ${JSON.stringify(allResults, null, 2)};
`;

fs.writeFileSync(outputPath, outputContent);
console.log(`Generated scenario results at: ${outputPath}`); 