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
                    .filter(part => part.type === 'text')
                    .map(part => part.text)
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
export function getScenarioResults(scenarioName: string): FormattedResult[] {
    const results: FormattedResult[] = [];

    const resultsDir = path.join(process.cwd(), 'results', scenarioName);

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