#!/usr/bin/env ts-node
/**
 * Script to run a prompt through a model from the command line
 * 
 * Usage:
 * ts-node run-prompt.ts <prompt-path> <model-id>
 * 
 * Example:
 * ts-node run-prompt.ts prompts/ethics/trolley-problem.md gpt-4
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import { modelIds } from './models/config';
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

    // Check for required arguments
    if (args.length < 1) {
        console.log('Usage: ts-node run-prompt.ts <prompt-path> [model-id]');
        console.log('       ts-node run-prompt.ts list');
        console.log('       ts-node run-prompt.ts models');
        return;
    }

    const promptPath = args[0];
    const modelId = args[1] || 'gpt-4'; // Default to GPT-4 if not specified

    try {
        console.log(`Running prompt: ${promptPath}`);
        console.log(`Model: ${modelId}`);

        const result = await runPrompt(promptPath, modelId, apiKeys);

        console.log('\nResults saved to:', path.basename(result.promptPath, '.md'));
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
        console.log(`\nFull response saved to results/${path.basename(promptPath, '.md')}/${modelId}/`);

    } catch (error) {
        console.error('Error running prompt:', error);
    }
}

main(); 