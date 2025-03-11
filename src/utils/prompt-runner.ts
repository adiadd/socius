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
    formattedPrompt?: string; // The content after applying the template
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
 * Apply prompt template to a scenario
 */
export function applyPromptTemplate(promptContent: PromptContent): string {
    // Load the template using __dirname to get the absolute path
    // This ensures we find the template regardless of working directory
    const templatePath = path.join(__dirname, '..', 'templates', 'prompt-template.md');
    let template: string;

    try {
        template = fs.readFileSync(templatePath, 'utf8');
        // Extract just the template content from between the backticks
        const templateMatch = template.match(/```\n([\s\S]*?)\n```/);
        if (templateMatch) {
            template = templateMatch[1];
        } else {
            console.warn("Template format not as expected, using raw template file");
        }
    } catch (error) {
        console.warn("Prompt template not found, using default format");
        return promptContent.content;
    }

    // Replace placeholders with actual content
    return template
        .replace('[SCENARIO_TITLE]', promptContent.metadata.title)
        .replace('[SCENARIO_CONTENT]', promptContent.content);
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

    // Apply the prompt template
    const formattedPrompt = applyPromptTemplate(promptContent);

    // Run the appropriate model
    let response;
    if (isOpenAIConfig(modelConfig)) {
        response = await runOpenAIPrompt(
            formattedPrompt,
            modelConfig,
            modelId as OpenAIModelId,
            apiKeys.openai
        );
    } else if (isAnthropicConfig(modelConfig)) {
        response = await runClaudePrompt(
            formattedPrompt,
            modelConfig,
            modelId as AnthropicModelId,
            apiKeys.anthropic
        );
    } else if (isGoogleConfig(modelConfig)) {
        response = await runGeminiPrompt(
            formattedPrompt,
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
        promptContent: {
            ...promptContent,
            // Store the formatted prompt that was actually sent to the model
            formattedPrompt
        },
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
    // Use __dirname to get absolute path regardless of working directory
    const promptsDir = path.join(__dirname, '..', 'prompts');
    const relativePath = path.relative(promptsDir, promptPath);
    const relativeDir = path.dirname(relativePath);

    // Extract scenario name from prompt path
    const scenarioName = path.basename(promptPath, path.extname(promptPath));

    // Create directory if it doesn't exist
    const resultDir = path.join(
        __dirname,
        '..',
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
    // Use __dirname to get absolute path regardless of working directory
    const promptsDir = path.join(__dirname, '..', 'prompts');
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