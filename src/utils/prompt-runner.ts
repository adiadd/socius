/**
 * Utility to run prompts through different AI models
 */
import * as fs from 'fs';
import * as path from 'path';
import { parse as parseYaml } from 'yaml';
import { runClaudePrompt } from '../models/anthropic';
import {
    AnthropicModelId,
    defaultModel,
    GoogleModelId,
    isAnthropicConfig,
    isGoogleConfig,
    isOpenAIConfig,
    ModelConfig,
    modelConfigs,
    ModelId,
    OpenAIModelId
} from '../models/config';
import { runGeminiPrompt } from '../models/google';
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
    modelId: ModelId;
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
    modelId: ModelId = defaultModel,
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
    if (isOpenAIConfig(modelConfig)) {
        response = await runOpenAIPrompt(
            promptContent.content,
            modelConfig,
            modelId as OpenAIModelId,
            apiKeys.openai
        );
    } else if (isAnthropicConfig(modelConfig)) {
        response = await runClaudePrompt(
            promptContent.content,
            modelConfig,
            modelId as AnthropicModelId,
            apiKeys.anthropic
        );
    } else if (isGoogleConfig(modelConfig)) {
        response = await runGeminiPrompt(
            promptContent.content,
            modelConfig,
            modelId as GoogleModelId,
            apiKeys.google
        );
    } else {
        throw new Error(`Unsupported model provider`);
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

    // Extract relative path from the prompts directory
    const promptsDir = path.join(process.cwd(), 'prompts');
    const relativePath = path.relative(promptsDir, promptPath);
    const relativeDir = path.dirname(relativePath);

    // Extract scenario name from prompt path
    const scenarioName = path.basename(promptPath, path.extname(promptPath));

    // Create directory if it doesn't exist
    const resultDir = path.join(
        process.cwd(),
        'results',
        relativeDir,  // Preserve the subdirectory structure (e.g., 'ethics')
        scenarioName,
        modelId
    );
    fs.mkdirSync(resultDir, { recursive: true });

    // Add timestamp to filename for unique results
    const dateStr = new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD format
    const resultPath = path.join(resultDir, `${dateStr}.json`);

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