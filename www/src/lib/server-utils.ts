import fs from 'fs';
import path from 'path';
import 'server-only';
import { ModelResult, ScenarioResult } from './utils';

// Correctly resolve the path to src/results
function getResultsDir() {
    // From www/src/lib, go up to www/, then up to project root, then to src/results
    return path.join(process.cwd(), '..', 'src', 'results');
}

// Function to recursively traverse directories and collect JSON files
function collectResults(categoryId: string, scenarioId: string, modelId: string) {
    const resultsDir = getResultsDir();
    const modelPath = path.join(resultsDir, categoryId, scenarioId, modelId);
    const results: Record<string, any> = {};

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

// Function to get all results organized by category and scenario
export function getAllResults() {
    const resultsDir = getResultsDir();
    console.log('Looking for results in:', resultsDir);
    const results: Record<string, Record<string, any>> = {};

    if (!fs.existsSync(resultsDir)) {
        console.error('Results directory not found:', resultsDir);
        return results;
    }

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
                modelResults: {} as Record<string, Record<string, any>>
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

// Function to get specific scenario results
export function getScenarioResults(categoryId: string, scenarioId: string) {
    const resultsDir = getResultsDir();
    const scenarioPath = path.join(resultsDir, categoryId, scenarioId);

    if (!fs.existsSync(scenarioPath)) {
        return null;
    }

    const scenarioResult = {
        scenarioId,
        categoryId,
        modelResults: {} as Record<string, Record<string, any>>
    };

    // Get all models for this scenario
    const models = fs.readdirSync(scenarioPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const modelId of models) {
        scenarioResult.modelResults[modelId] = collectResults(categoryId, scenarioId, modelId);
    }

    return scenarioResult;
}

// Function to get a specific result
export function getSpecificResult(categoryId: string, scenarioId: string, modelId: string, date: string) {
    const resultsDir = getResultsDir();
    const filePath = path.join(resultsDir, categoryId, scenarioId, modelId, `${date}.json`);

    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const result = JSON.parse(fileContent);
        return result;
    } catch (error) {
        console.error(`Error reading or parsing ${filePath}:`, error);
        return null;
    }
}

// Server-side function to get all results
export async function getAllScenarioResults(): Promise<{ [categoryId: string]: { [scenarioId: string]: ScenarioResult } }> {
    return getAllResults();
}

// Server-side function to get latest results for a scenario
export async function getLatestResultsForScenario(categoryId: string, scenarioId: string): Promise<{ [modelId: string]: ModelResult }> {
    const scenarioResults = getScenarioResults(categoryId, scenarioId);

    if (!scenarioResults?.modelResults) {
        return {};
    }

    const latestResults: { [modelId: string]: ModelResult } = {};

    for (const modelId in scenarioResults.modelResults) {
        const modelDates = Object.keys(scenarioResults.modelResults[modelId]);
        if (modelDates.length > 0) {
            // Sort dates in descending order
            modelDates.sort((a, b) => b.localeCompare(a));
            latestResults[modelId] = scenarioResults.modelResults[modelId][modelDates[0]];
        }
    }

    return latestResults;
}

// Server-side function to get a specific result
export async function getScenarioResult(categoryId: string, scenarioId: string, modelId: string, date: string): Promise<ModelResult | null> {
    return getSpecificResult(categoryId, scenarioId, modelId, date);
} 