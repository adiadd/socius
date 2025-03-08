/**
 * Utility for formatting AI model results consistently
 */
import * as fs from 'fs';
import * as path from 'path';

interface FormattedResult {
    scenarioName: string;
    modelName: string;
    modelProvider: string;
    timestamp: string;
    content: string;
    metadata: {
        modelVersion: string;
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
        elapsedTimeMs: number;
    };
}

/**
 * Extracts the text content from different model response formats
 */
export function extractResponseContent(modelProvider: string, response: any): string {
    switch (modelProvider.toLowerCase()) {
        case 'openai':
            return response.choices[0]?.message?.content || '';
        case 'anthropic':
            // For Claude responses
            if (response.content && Array.isArray(response.content)) {
                return response.content
                    .filter((part: any) => part.type === 'text')
                    .map((part: any) => part.text)
                    .join('');
            }
            return '';
        default:
            throw new Error(`Unsupported model provider: ${modelProvider}`);
    }
}

/**
 * Extracts token usage from different model response formats
 */
export function extractTokenUsage(modelProvider: string, response: any): {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
} {
    switch (modelProvider.toLowerCase()) {
        case 'openai':
            return {
                promptTokens: response.usage?.prompt_tokens,
                completionTokens: response.usage?.completion_tokens,
                totalTokens: response.usage?.total_tokens
            };
        case 'anthropic':
            return {
                promptTokens: response.usage?.input_tokens,
                completionTokens: response.usage?.output_tokens,
                totalTokens: response.usage?.input_tokens + response.usage?.output_tokens
            };
        default:
            return {};
    }
}

/**
 * Format a result into a standardized format
 */
export function formatResult(resultPath: string): FormattedResult {
    const rawResult = JSON.parse(fs.readFileSync(resultPath, 'utf8'));

    const {
        modelId,
        modelConfig,
        promptPath,
        response,
        timestamp,
        elapsedTimeMs
    } = rawResult;

    // Extract scenario name from prompt path
    const scenarioName = path.basename(promptPath, path.extname(promptPath));

    // Extract content based on model provider
    const content = extractResponseContent(modelConfig.provider, response);

    // Extract token usage
    const tokenUsage = extractTokenUsage(modelConfig.provider, response);

    return {
        scenarioName,
        modelName: modelConfig.name,
        modelProvider: modelConfig.provider,
        timestamp,
        content,
        metadata: {
            modelVersion: modelConfig.version,
            ...tokenUsage,
            elapsedTimeMs
        }
    };
}

/**
 * Read all result files for a scenario
 */
export function getScenarioResults(scenarioPath: string): FormattedResult[] {
    const results: FormattedResult[] = [];

    // Handle both category/scenario format and just scenario name
    let resultsDir;
    if (scenarioPath.includes('/')) {
        // Full path provided (e.g., "ethics/trolley-problem")
        resultsDir = path.join(process.cwd(), 'results', scenarioPath);
    } else {
        // Just scenario name, need to search in all categories
        const baseResultsDir = path.join(process.cwd(), 'results');

        // Find all instances of this scenario name in any category
        if (fs.existsSync(baseResultsDir)) {
            const categories = fs.readdirSync(baseResultsDir)
                .filter(item => fs.statSync(path.join(baseResultsDir, item)).isDirectory());

            for (const category of categories) {
                const categoryDir = path.join(baseResultsDir, category);
                const scenarios = fs.readdirSync(categoryDir)
                    .filter(item => fs.statSync(path.join(categoryDir, item)).isDirectory());

                if (scenarios.includes(scenarioPath)) {
                    const scenarioResults = getScenarioResults(`${category}/${scenarioPath}`);
                    results.push(...scenarioResults);
                }
            }
        }

        return results;
    }

    if (!fs.existsSync(resultsDir)) {
        return results;
    }

    // Get model directories
    const modelDirs = fs.readdirSync(resultsDir)
        .filter(item => fs.statSync(path.join(resultsDir, item)).isDirectory());

    for (const modelDir of modelDirs) {
        const modelResultsDir = path.join(resultsDir, modelDir);

        // Get result files
        const resultFiles = fs.readdirSync(modelResultsDir)
            .filter(file => path.extname(file) === '.json');

        for (const resultFile of resultFiles) {
            const resultPath = path.join(modelResultsDir, resultFile);
            results.push(formatResult(resultPath));
        }
    }

    // Sort by timestamp, newest first
    return results.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
} 