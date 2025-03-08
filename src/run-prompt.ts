#!/usr/bin/env bun
/**
 * Script to run a prompt through a model from the command line
 * 
 * Usage:
 * bun run run-prompt.ts <prompt-path> [model-id]
 * bun run run-prompt.ts run-all [model-id]
 * bun run run-prompt.ts list
 * bun run run-prompt.ts models
 * 
 * Or using bun scripts:
 * bun run run-prompt -- <prompt-path> [model-id]
 * bun run run-all-prompts [model-id]
 * bun run list-prompts
 * bun run list-models
 * 
 * Example:
 * bun run run-prompt.ts prompts/ethics/trolley-problem.md gpt-4
 * bun run run-prompt.ts run-all gpt-4
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ModelId, defaultModel, modelIds } from './models/config';
import { listAllPrompts, runPrompt } from './utils/prompt-runner';

// Load environment variables from .env file
dotenv.config();

// Get API keys from environment variables
const apiKeys = {
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    google: process.env.GOOGLE_API_KEY || '',
};

async function main() {
    const args = process.argv.slice(2);

    // List all prompts if requested
    if (args[0] === 'list') {
        console.log('Available prompts:');
        const prompts = listAllPrompts();
        prompts.forEach(promptPath => {
            const relativePath = path.relative(process.cwd(), promptPath);
            console.log(`- ${relativePath}`);
        });
        return;
    }

    // List all models if requested
    if (args[0] === 'models') {
        console.log('Available models:');
        modelIds.forEach(modelId => console.log(`- ${modelId}`));
        return;
    }

    // Run all prompts if requested
    if (args[0] === 'run-all') {
        const modelId = (args[1] as ModelId) || defaultModel;
        console.log(`Running all prompts with model: ${modelId}`);

        const prompts = listAllPrompts();
        console.log(`Found ${prompts.length} prompts to run`);

        for (let i = 0; i < prompts.length; i++) {
            const promptPath = prompts[i];
            const relativePath = path.relative(process.cwd(), promptPath);
            console.log(`\n[${i + 1}/${prompts.length}] Running prompt: ${relativePath}`);

            try {
                const result = await runPrompt(promptPath, modelId as ModelId, apiKeys);

                console.log(`- Model: ${result.modelConfig.name}`);
                console.log(`- Time: ${result.elapsedTimeMs / 1000}s`);

                if (result.response.usage) {
                    console.log('- Tokens used:');
                    if (result.response.usage.prompt_tokens) {
                        console.log(`  Prompt: ${result.response.usage.prompt_tokens}`);
                        console.log(`  Completion: ${result.response.usage.completion_tokens}`);
                        console.log(`  Total: ${result.response.usage.total_tokens}`);
                    } else if (result.response.usage.input_tokens) {
                        console.log(`  Input: ${result.response.usage.input_tokens}`);
                        console.log(`  Output: ${result.response.usage.output_tokens}`);
                        console.log(`  Total: ${result.response.usage.input_tokens + result.response.usage.output_tokens}`);
                    }
                }

                // Extract the relative path from the prompts directory for display
                const promptsDir = path.join(process.cwd(), 'prompts');
                const promptRelativePath = path.relative(promptsDir, promptPath);
                const relativeDir = path.dirname(promptRelativePath);
                const scenarioName = path.basename(promptPath, path.extname(promptPath));

                console.log(`- Results saved to: results/${relativeDir}/${scenarioName}/${modelId}/`);
            } catch (error) {
                console.error(`Error running prompt ${relativePath}:`, error);
            }
        }

        console.log('\nFinished running all prompts');
        return;
    }

    // Check for required arguments
    if (args.length < 1) {
        console.log('Usage:');
        console.log('  bun run run-prompt.ts <prompt-path> [model-id]  - Run a specific prompt');
        console.log('  bun run run-prompt.ts run-all [model-id]        - Run all prompts');
        console.log('  bun run run-prompt.ts list                      - List available prompts');
        console.log('  bun run run-prompt.ts models                    - List available models');
        console.log('\nOr using bun scripts:');
        console.log('  bun run run-prompt -- <prompt-path> [model-id]');
        console.log('  bun run run-all-prompts [model-id]');
        console.log('  bun run list-prompts');
        console.log('  bun run list-models');
        return;
    }

    const promptPath = args[0];
    const modelId = (args[1] as ModelId) || defaultModel;

    try {
        console.log(`Running prompt: ${promptPath}`);
        console.log(`Model: ${modelId}`);

        const result = await runPrompt(promptPath, modelId, apiKeys);

        // Extract the relative path from the prompts directory for display
        const promptsDir = path.join(process.cwd(), 'prompts');
        let resultDisplay = path.basename(result.promptPath, '.md');

        // If the prompt is in the prompts directory, show the relative path
        if (result.promptPath.includes(promptsDir)) {
            const promptRelativePath = path.relative(promptsDir, result.promptPath);
            const relativeDir = path.dirname(promptRelativePath);
            const scenarioName = path.basename(result.promptPath, path.extname(result.promptPath));
            resultDisplay = `${relativeDir}/${scenarioName}`;
        }

        console.log('\nResults saved to:', resultDisplay);
        console.log(`- Model: ${result.modelConfig.name}`);
        console.log(`- Time: ${result.elapsedTimeMs / 1000}s`);

        if (result.response.usage) {
            console.log('- Tokens used:');
            if (result.response.usage.prompt_tokens) {
                console.log(`  Prompt: ${result.response.usage.prompt_tokens}`);
                console.log(`  Completion: ${result.response.usage.completion_tokens}`);
                console.log(`  Total: ${result.response.usage.total_tokens}`);
            } else if (result.response.usage.input_tokens) {
                console.log(`  Input: ${result.response.usage.input_tokens}`);
                console.log(`  Output: ${result.response.usage.output_tokens}`);
                console.log(`  Total: ${result.response.usage.input_tokens + result.response.usage.output_tokens}`);
            }
        }

        // Print a snippet of the response
        let responseText = '';
        if (result.modelConfig.provider.toLowerCase() === 'openai') {
            responseText = result.response.choices[0]?.message?.content || '';
        } else if (result.modelConfig.provider.toLowerCase() === 'anthropic') {
            if (result.response.content && Array.isArray(result.response.content)) {
                responseText = result.response.content
                    .filter((part: any) => part.type === 'text')
                    .map((part: any) => part.text)
                    .join('');
            }
        }

        // Print first 200 characters of response
        console.log('\nResponse preview:');
        console.log(responseText.slice(0, 200) + (responseText.length > 200 ? '...' : ''));
        console.log(`\nFull response saved to results/${resultDisplay}/${modelId}/`);

    } catch (error) {
        console.error('Error running prompt:', error);
    }
}

main(); 