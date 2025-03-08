#!/usr/bin/env bun
/**
 * socius CLI - anthropocentric scenarios for ai
 */
import chalk from 'chalk';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import inquirer from 'inquirer';
import * as path from 'path';
import { ModelId, defaultModel, modelConfigs, modelIds } from './models/config';
import { listAllPrompts, runPrompt } from './utils/prompt-runner';

// Load environment variables
dotenv.config();

// Initialize CLI
const program = new Command();

// Get API keys from environment variables
const apiKeys = {
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    google: process.env.GOOGLE_API_KEY || '',
};

// Utility functions
function checkApiKeys(): { valid: boolean, missing: string[] } {
    const missing: string[] = [];

    // Check OpenAI API key
    if (!apiKeys.openai) {
        missing.push('OpenAI');
    }

    // Check Anthropic API key
    if (!apiKeys.anthropic) {
        missing.push('Anthropic');
    }

    // Check Google API key
    if (!apiKeys.google) {
        missing.push('Google');
    }

    return {
        valid: missing.length === 0,
        missing
    };
}

// Group prompts by category
function groupPromptsByCategory(prompts: string[]): Record<string, string[]> {
    const promptsDir = path.join(process.cwd(), 'prompts');
    const categories: Record<string, string[]> = {};

    prompts.forEach(promptPath => {
        const relativePath = path.relative(promptsDir, promptPath);
        const category = relativePath.split(path.sep)[0];

        if (!categories[category]) {
            categories[category] = [];
        }

        categories[category].push(promptPath);
    });

    return categories;
}

// CLI Configuration
program
    .name('socius')
    .description('socius CLI - anthropocentric scenarios for ai')
    .version('0.1.0');

// Run command
program
    .command('run')
    .description('Run a specific prompt or all prompts')
    .option('-p, --prompt <path>', 'Path to prompt file')
    .option('-m, --model <model>', 'Model ID to use', defaultModel)
    .option('-a, --all', 'Run all prompts')
    .action(async (options: { prompt?: string; model: string; all?: boolean }) => {
        console.log(chalk.bold.blue('🧠 socius - Running prompts'));

        // Check API keys
        const keyCheck = checkApiKeys();
        if (!keyCheck.valid) {
            console.log(chalk.yellow('\n⚠️ Warning: Some API keys are missing:'));
            keyCheck.missing.forEach(provider => {
                console.log(chalk.yellow(`  - ${provider}: Missing API key`));
            });
            console.log(chalk.yellow('You may not be able to run prompts with these providers.\n'));
        }

        // If no prompt path or all flag, ask interactively
        if (!options.prompt && !options.all) {
            const answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'runType',
                    message: 'What would you like to run?',
                    choices: [
                        { name: 'Run a specific prompt', value: 'specific' },
                        { name: 'Run all prompts', value: 'all' }
                    ]
                }
            ]);

            options.all = answers.runType === 'all';

            if (answers.runType === 'specific') {
                const prompts = listAllPrompts();
                const categories = groupPromptsByCategory(prompts);

                // First select category
                const categoryAnswers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'category',
                        message: 'Select a category:',
                        choices: Object.keys(categories)
                    }
                ]);

                // Then select prompt from that category
                const categoryPrompts = categories[categoryAnswers.category];
                const promptsDir = path.join(process.cwd(), 'prompts');

                const promptAnswers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'promptPath',
                        message: 'Select a prompt:',
                        choices: categoryPrompts.map(p => ({
                            name: path.basename(p, '.md'),
                            value: p
                        }))
                    }
                ]);

                options.prompt = promptAnswers.promptPath;
            }
        }

        // If no model specified, ask interactively
        if (!options.model) {
            const modelAnswers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'model',
                    message: 'Select a model:',
                    choices: modelIds.map(id => ({
                        name: `${modelConfigs[id].name} (${modelConfigs[id].provider})`,
                        value: id
                    }))
                }
            ]);

            options.model = modelAnswers.model;
        }

        try {
            if (options.all) {
                console.log(chalk.blue(`\nRunning all prompts with model: ${chalk.bold(options.model)}`));

                const prompts = listAllPrompts();
                console.log(chalk.blue(`Found ${prompts.length} prompts to run\n`));

                for (let i = 0; i < prompts.length; i++) {
                    const promptPath = prompts[i];
                    const relativePath = path.relative(process.cwd(), promptPath);
                    console.log(chalk.blue(`\n[${i + 1}/${prompts.length}] Running prompt: ${chalk.bold(relativePath)}`));

                    try {
                        const result = await runPrompt(promptPath, options.model as ModelId, apiKeys);

                        console.log(chalk.green('✅ Success!'));
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

                        console.log(`- Results saved to: ${chalk.bold(`results/${relativeDir}/${scenarioName}/${options.model}/`)}`);
                    } catch (error) {
                        console.error(chalk.red(`Error running prompt ${relativePath}:`), error);
                    }
                }

                console.log(chalk.green('\n✅ Finished running all prompts'));
            } else {
                console.log(chalk.blue(`\nRunning prompt: ${chalk.bold(options.prompt)}`));
                console.log(chalk.blue(`Model: ${chalk.bold(options.model)}`));

                // Ensure prompt path is defined
                if (!options.prompt) {
                    console.error(chalk.red('Error: No prompt path specified'));
                    return;
                }

                const result = await runPrompt(options.prompt, options.model as ModelId, apiKeys);

                console.log(chalk.green('\n✅ Success!'));

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

                console.log('\nResponse preview:');
                console.log(chalk.cyan(responseText.slice(0, 200) + (responseText.length > 200 ? '...' : '')));
                console.log(chalk.blue(`\nFull response saved to ${chalk.bold(`results/${resultDisplay}/${options.model}/`)}`));
            }
        } catch (error) {
            console.error(chalk.red('Error running prompt:'), error);
        }
    });

// List prompts command
program
    .command('list')
    .description('List available prompts')
    .action(() => {
        console.log(chalk.bold.blue('🧠 socius - Available prompts\n'));

        const prompts = listAllPrompts();
        const categories = groupPromptsByCategory(prompts);

        Object.entries(categories).forEach(([category, categoryPrompts]) => {
            console.log(chalk.blue(`${chalk.bold(category)} (${categoryPrompts.length} prompts):`));

            categoryPrompts.forEach(promptPath => {
                const promptsDir = path.join(process.cwd(), 'prompts');
                const relativePath = path.relative(promptsDir, promptPath);
                console.log(`- ${path.basename(promptPath, '.md')}`);
            });

            console.log(''); // Empty line between categories
        });
    });

// List models command
program
    .command('models')
    .description('List available models')
    .action(() => {
        console.log(chalk.bold.blue('🧠 socius - Available models\n'));

        // Group models by provider
        const modelsByProvider: Record<string, ModelId[]> = {};

        modelIds.forEach(modelId => {
            const provider = modelConfigs[modelId].provider;

            if (!modelsByProvider[provider]) {
                modelsByProvider[provider] = [];
            }

            modelsByProvider[provider].push(modelId);
        });

        Object.entries(modelsByProvider).forEach(([provider, providerModels]) => {
            console.log(chalk.blue(`${chalk.bold(provider)} models:`));

            providerModels.forEach(modelId => {
                const model = modelConfigs[modelId];
                console.log(`- ${model.name} (${modelId})`);
            });

            console.log(''); // Empty line between providers
        });

        // Check API keys
        const keyCheck = checkApiKeys();
        if (!keyCheck.valid) {
            console.log(chalk.yellow('⚠️ Warning: Some API keys are missing:'));
            keyCheck.missing.forEach(provider => {
                console.log(chalk.yellow(`  - ${provider}: Missing API key`));
            });
            console.log(chalk.yellow('\nTo set API keys, add them to your .env file:'));
            console.log(chalk.yellow('OPENAI_API_KEY=your_openai_key'));
            console.log(chalk.yellow('ANTHROPIC_API_KEY=your_anthropic_key'));
            console.log(chalk.yellow('GOOGLE_API_KEY=your_google_key'));
        }
    });

// API key management commands
program
    .command('check-keys')
    .description('Check if API keys are configured')
    .action(() => {
        console.log(chalk.bold.blue('🧠 socius - API Key Check\n'));

        const keyCheck = checkApiKeys();

        if (keyCheck.valid) {
            console.log(chalk.green('✅ All API keys are configured'));
        } else {
            console.log(chalk.yellow('⚠️ Some API keys are missing:'));
            keyCheck.missing.forEach(provider => {
                console.log(chalk.yellow(`  - ${provider}: Missing API key`));
            });

            console.log(chalk.blue('\nTo set API keys, add them to your .env file:'));

            if (keyCheck.missing.includes('OpenAI')) {
                console.log(chalk.blue('OPENAI_API_KEY=your_openai_key'));
            }

            if (keyCheck.missing.includes('Anthropic')) {
                console.log(chalk.blue('ANTHROPIC_API_KEY=your_anthropic_key'));
            }

            if (keyCheck.missing.includes('Google')) {
                console.log(chalk.blue('GOOGLE_API_KEY=your_google_key'));
            }
        }
    });

// Create new prompt command
program
    .command('create')
    .description('Create a new prompt file')
    .action(async () => {
        console.log(chalk.bold.blue('🧠 socius - Create New Prompt\n'));

        // Get the list of existing categories (directories in prompts folder)
        const promptsDir = path.join(process.cwd(), 'prompts');
        const categories = fs.readdirSync(promptsDir)
            .filter(file => fs.statSync(path.join(promptsDir, file)).isDirectory());

        // Ask for prompt details
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter prompt title:',
                validate: (input: string) => input.trim().length > 0 || 'Title is required'
            },
            {
                type: 'list',
                name: 'category',
                message: 'Select a category:',
                choices: [
                    ...categories,
                    { name: 'Create new category', value: 'new' }
                ]
            },
            {
                type: 'input',
                name: 'newCategory',
                message: 'Enter new category name:',
                when: (answers: any) => answers.category === 'new',
                validate: (input: string) => {
                    if (input.trim().length === 0) return 'Category name is required';
                    if (categories.includes(input)) return 'Category already exists';
                    return true;
                }
            },
            {
                type: 'input',
                name: 'tags',
                message: 'Enter tags (comma separated):',
                default: ''
            },
            {
                type: 'list',
                name: 'difficulty',
                message: 'Select difficulty level:',
                choices: ['easy', 'medium', 'hard']
            }
        ]);

        // Determine the category
        const category = answers.category === 'new' ? answers.newCategory : answers.category;

        // Generate filename from title
        const filename = answers.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '.md';

        // Create category directory if needed
        const categoryDir = path.join(promptsDir, category);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }

        // Generate prompt file content
        const tags = answers.tags
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const promptContent = `---
title: "${answers.title}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
difficulty: "${answers.difficulty}"
createdAt: "${today}"
---

# ${answers.title}

[Your prompt content here]
`;

        // Write the file
        const promptPath = path.join(categoryDir, filename);
        fs.writeFileSync(promptPath, promptContent);

        console.log(chalk.green(`\n✅ Created new prompt: ${chalk.bold(promptPath)}`));
        console.log(chalk.blue('\nEdit this file to add your prompt content.'));
    });

// Add a new command for interactive mode
program
    .command('interactive')
    .alias('i')
    .description('Start an interactive CLI session')
    .action(async () => {
        console.log(chalk.bold.blue('🧠 socius - Interactive CLI Mode\n'));
        console.log(chalk.blue('Type "exit" or press Ctrl+C to quit.\n'));

        let running = true;
        while (running) {
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        { name: 'Run prompts', value: 'run' },
                        { name: 'List prompts', value: 'list' },
                        { name: 'List models', value: 'models' },
                        { name: 'Check API keys', value: 'check-keys' },
                        { name: 'Create new prompt', value: 'create' },
                        { name: 'Exit', value: 'exit' }
                    ]
                }
            ]);

            if (action === 'exit') {
                running = false;
                console.log(chalk.blue('\nGoodbye! 👋'));
            } else {
                // Execute the selected action
                switch (action) {
                    case 'run':
                        // Run the run command action directly
                        await handleRunCommand();
                        break;
                    case 'list':
                        // List prompts
                        await handleListPromptsCommand();
                        break;
                    case 'models':
                        // List models
                        await handleListModelsCommand();
                        break;
                    case 'check-keys':
                        // Check API keys
                        await handleCheckKeysCommand();
                        break;
                    case 'create':
                        // Create new prompt
                        await handleCreatePromptCommand();
                        break;
                }
                console.log('\n'); // Add space after command output
            }
        }
    });

// Implement handlers for each command
async function handleRunCommand() {
    console.log(chalk.bold.blue('🧠 socius - Running prompts'));

    // Check API keys
    const keyCheck = checkApiKeys();
    if (!keyCheck.valid) {
        console.log(chalk.yellow('\n⚠️ Warning: Some API keys are missing:'));
        keyCheck.missing.forEach(provider => {
            console.log(chalk.yellow(`  - ${provider}: Missing API key`));
        });
        console.log(chalk.yellow('You may not be able to run prompts with these providers.\n'));
    }

    // Ask interactively what to run
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'runType',
            message: 'What would you like to run?',
            choices: [
                { name: 'Run a specific prompt', value: 'specific' },
                { name: 'Run all prompts', value: 'all' }
            ]
        }
    ]);

    const options: { prompt?: string; model: string; all?: boolean } = {
        model: defaultModel
    };

    options.all = answers.runType === 'all';

    if (answers.runType === 'specific') {
        const prompts = listAllPrompts();
        const categories = groupPromptsByCategory(prompts);

        // First select category
        const categoryAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'category',
                message: 'Select a category:',
                choices: Object.keys(categories)
            }
        ]);

        // Then select prompt from that category
        const categoryPrompts = categories[categoryAnswers.category];
        const promptsDir = path.join(process.cwd(), 'prompts');

        const promptAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'promptPath',
                message: 'Select a prompt:',
                choices: categoryPrompts.map(p => ({
                    name: path.basename(p, '.md'),
                    value: p
                }))
            }
        ]);

        options.prompt = promptAnswers.promptPath;
    }

    // Select model
    const modelAnswers = await inquirer.prompt([
        {
            type: 'list',
            name: 'model',
            message: 'Select a model:',
            choices: modelIds.map(id => ({
                name: `${modelConfigs[id].name} (${modelConfigs[id].provider})`,
                value: id
            }))
        }
    ]);

    options.model = modelAnswers.model;

    // Run prompts based on options
    try {
        if (options.all) {
            console.log(chalk.blue(`\nRunning all prompts with model: ${chalk.bold(options.model)}`));

            const prompts = listAllPrompts();
            console.log(chalk.blue(`Found ${prompts.length} prompts to run\n`));

            for (let i = 0; i < prompts.length; i++) {
                const promptPath = prompts[i];
                const relativePath = path.relative(process.cwd(), promptPath);
                console.log(chalk.blue(`\n[${i + 1}/${prompts.length}] Running prompt: ${chalk.bold(relativePath)}`));

                try {
                    const result = await runPrompt(promptPath, options.model as ModelId, apiKeys);

                    console.log(chalk.green('✅ Success!'));
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

                    console.log(`- Results saved to: ${chalk.bold(`results/${relativeDir}/${scenarioName}/${options.model}/`)}`);
                } catch (error) {
                    console.error(chalk.red(`Error running prompt ${relativePath}:`), error);
                }
            }

            console.log(chalk.green('\n✅ Finished running all prompts'));
        } else {
            console.log(chalk.blue(`\nRunning prompt: ${chalk.bold(options.prompt)}`));
            console.log(chalk.blue(`Model: ${chalk.bold(options.model)}`));

            // Ensure prompt path is defined
            if (!options.prompt) {
                console.error(chalk.red('Error: No prompt path specified'));
                return;
            }

            const result = await runPrompt(options.prompt, options.model as ModelId, apiKeys);

            console.log(chalk.green('\n✅ Success!'));

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

            console.log('\nResponse preview:');
            console.log(chalk.cyan(responseText.slice(0, 200) + (responseText.length > 200 ? '...' : '')));
            console.log(chalk.blue(`\nFull response saved to ${chalk.bold(`results/${resultDisplay}/${options.model}/`)}`));
        }
    } catch (error) {
        console.error(chalk.red('Error running prompt:'), error);
    }
}

async function handleListPromptsCommand() {
    console.log(chalk.bold.blue('🧠 socius - Available prompts\n'));

    const prompts = listAllPrompts();
    const categories = groupPromptsByCategory(prompts);

    Object.entries(categories).forEach(([category, categoryPrompts]) => {
        console.log(chalk.blue(`${chalk.bold(category)} (${categoryPrompts.length} prompts):`));

        categoryPrompts.forEach(promptPath => {
            const promptsDir = path.join(process.cwd(), 'prompts');
            const relativePath = path.relative(promptsDir, promptPath);
            console.log(`- ${path.basename(promptPath, '.md')}`);
        });

        console.log(''); // Empty line between categories
    });
}

async function handleListModelsCommand() {
    console.log(chalk.bold.blue('🧠 socius - Available models\n'));

    // Group models by provider
    const modelsByProvider: Record<string, ModelId[]> = {};

    modelIds.forEach(modelId => {
        const provider = modelConfigs[modelId].provider;

        if (!modelsByProvider[provider]) {
            modelsByProvider[provider] = [];
        }

        modelsByProvider[provider].push(modelId);
    });

    Object.entries(modelsByProvider).forEach(([provider, providerModels]) => {
        console.log(chalk.blue(`${chalk.bold(provider)} models:`));

        providerModels.forEach(modelId => {
            const model = modelConfigs[modelId];
            console.log(`- ${model.name} (${modelId})`);
        });

        console.log(''); // Empty line between providers
    });

    // Check API keys
    const keyCheck = checkApiKeys();
    if (!keyCheck.valid) {
        console.log(chalk.yellow('⚠️ Warning: Some API keys are missing:'));
        keyCheck.missing.forEach(provider => {
            console.log(chalk.yellow(`  - ${provider}: Missing API key`));
        });
        console.log(chalk.yellow('\nTo set API keys, add them to your .env file:'));
        console.log(chalk.yellow('OPENAI_API_KEY=your_openai_key'));
        console.log(chalk.yellow('ANTHROPIC_API_KEY=your_anthropic_key'));
        console.log(chalk.yellow('GOOGLE_API_KEY=your_google_key'));
    }
}

async function handleCheckKeysCommand() {
    console.log(chalk.bold.blue('🧠 socius - API Key Check\n'));

    const keyCheck = checkApiKeys();

    if (keyCheck.valid) {
        console.log(chalk.green('✅ All API keys are configured'));
    } else {
        console.log(chalk.yellow('⚠️ Some API keys are missing:'));
        keyCheck.missing.forEach(provider => {
            console.log(chalk.yellow(`  - ${provider}: Missing API key`));
        });

        console.log(chalk.blue('\nTo set API keys, add them to your .env file:'));

        if (keyCheck.missing.includes('OpenAI')) {
            console.log(chalk.blue('OPENAI_API_KEY=your_openai_key'));
        }

        if (keyCheck.missing.includes('Anthropic')) {
            console.log(chalk.blue('ANTHROPIC_API_KEY=your_anthropic_key'));
        }

        if (keyCheck.missing.includes('Google')) {
            console.log(chalk.blue('GOOGLE_API_KEY=your_google_key'));
        }
    }
}

async function handleCreatePromptCommand() {
    console.log(chalk.bold.blue('🧠 socius - Create New Prompt\n'));

    // Get the list of existing categories (directories in prompts folder)
    const promptsDir = path.join(process.cwd(), 'prompts');
    const categories = fs.readdirSync(promptsDir)
        .filter(file => fs.statSync(path.join(promptsDir, file)).isDirectory());

    // Ask for prompt details
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter prompt title:',
            validate: (input: string) => input.trim().length > 0 || 'Title is required'
        },
        {
            type: 'list',
            name: 'category',
            message: 'Select a category:',
            choices: [
                ...categories,
                { name: 'Create new category', value: 'new' }
            ]
        },
        {
            type: 'input',
            name: 'newCategory',
            message: 'Enter new category name:',
            when: (answers: any) => answers.category === 'new',
            validate: (input: string) => {
                if (input.trim().length === 0) return 'Category name is required';
                if (categories.includes(input)) return 'Category already exists';
                return true;
            }
        },
        {
            type: 'input',
            name: 'tags',
            message: 'Enter tags (comma separated):',
            default: ''
        },
        {
            type: 'list',
            name: 'difficulty',
            message: 'Select difficulty level:',
            choices: ['easy', 'medium', 'hard']
        }
    ]);

    // Determine the category
    const category = answers.category === 'new' ? answers.newCategory : answers.category;

    // Generate filename from title
    const filename = answers.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.md';

    // Create category directory if needed
    const categoryDir = path.join(promptsDir, category);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }

    // Generate prompt file content
    const tags = answers.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const promptContent = `---
title: "${answers.title}"
tags: [${tags.map((tag: string) => `"${tag}"`).join(', ')}]
difficulty: "${answers.difficulty}"
createdAt: "${today}"
---

# ${answers.title}

[Your prompt content here]
`;

    // Write the file
    const promptPath = path.join(categoryDir, filename);
    fs.writeFileSync(promptPath, promptContent);

    console.log(chalk.green(`\n✅ Created new prompt: ${chalk.bold(promptPath)}`));
    console.log(chalk.blue('\nEdit this file to add your prompt content.'));
}

// Make interactive mode the default if no command is specified
const originalParse = program.parse;
program.parse = function (argv?: string[]) {
    if (argv && argv.length <= 2) {
        // No command specified, run interactive mode
        argv = [...argv, 'interactive'];
    }
    return originalParse.call(this, argv);
};

// Execute the CLI
program.parse(process.argv); 