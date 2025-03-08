/**
 * Utility to run prompts through different AI models
 */
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { runClaudePrompt } from '../models/anthropic';
import { ModelConfig, defaultModel, modelConfigs } from '../models/config';
import { runOpenAIPrompt } from '../models/openai';

interface PromptMetadata {
    title: string;
    tags: string[];
    difficulty: string;
    createdAt: string;
}

interface PromptContent {
    metadata: PromptMetadata;
    content: string;
}

interface RunResult {
    modelId: string;
    modelConfig: ModelConfig;
    promptPath: string;
    promptContent: PromptContent;
    response: any;
    timestamp: string;
    elapsedTimeMs: number;
}

/**
 * Parse a prompt file (markdown with frontmatter)
 */
export function parsePromptFile(filePath: string): PromptContent {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Extract frontmatter
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
        throw new Error(`Invalid prompt file format: ${filePath}`);
    }

    const [, frontmatter, content] = frontmatterMatch;
    const metadata = parseYaml(frontmatter) as PromptMetadata;

    return {
        metadata,
        content: content.trim()
    };
}

/**
 * Run a prompt through a specified model
 */
export async function runPrompt(
    promptPath: string,
    modelId: string = defaultModel,
    apiKeys: Record<string, string>
): Promise<RunResult> {
    const modelConfig = modelConfigs[modelId];
    if (!modelConfig) {
        throw new Error(`Unknown model: ${modelId}`);
    }

    // Parse the prompt file
    const promptContent = parsePromptFile(promptPath);

    // Measure execution time
    const startTime = Date.now();

    // Run the appropriate model
    let response;
    switch (modelConfig.provider.toLowerCase()) {
        case 'openai':
            response = await runOpenAIPrompt(
                promptContent.content,
                modelConfig,
                apiKeys.openai
            );
            break;
        case 'anthropic':
            response = await runClaudePrompt(
                promptContent.content,
                modelConfig,
                apiKeys.anthropic
            );
            break;
        default:
            throw new Error(`Unsupported model provider: ${modelConfig.provider}`);
    }

    const elapsedTimeMs = Date.now() - startTime;

    // Create result object
    const result: RunResult = {
        modelId,
        modelConfig,
        promptPath,
        promptContent,
        response,
        timestamp: new Date().toISOString(),
        elapsedTimeMs
    };

    // Save result to file
    saveResult(result);

    return result;
}

/**
 * Save result to file
 */
function saveResult(result: RunResult): string {
    const { promptPath, modelId, timestamp } = result;

    // Extract scenario name from prompt path
    const scenarioName = path.basename(promptPath, path.extname(promptPath));

    // Create directory if it doesn't exist
    const resultDir = path.join(
        process.cwd(),
        'results',
        scenarioName,
        modelId
    );
    fs.mkdirSync(resultDir, { recursive: true });

    // Create filename from timestamp
    const timeStr = timestamp.replace(/[:.]/g, '-');
    const resultPath = path.join(resultDir, `${timeStr}.json`);

    // Write result to file
    fs.writeFileSync(
        resultPath,
        JSON.stringify(result, null, 2)
    );

    return resultPath;
}

/**
 * Get a list of all prompts in the prompts directory
 */
export function listAllPrompts(): string[] {
    const promptsDir = path.join(process.cwd(), 'prompts');
    const promptFiles: string[] = [];

    function traverseDir(dir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                traverseDir(filePath);
            } else if (path.extname(file) === '.md') {
                promptFiles.push(filePath);
            }
        }
    }

    traverseDir(promptsDir);
    return promptFiles;
} 