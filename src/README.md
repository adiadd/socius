# information

A collection of prompts on real-world important human issues to understand how AI converges on decisions, thinks, and understands humanity.

## Project Structure

```
socius/
├── prompts/                      # All scenario prompts
│   ├── ethics/                   # Ethical scenarios
│   ├── society/                  # Societal impact scenarios
│   ├── culture/                  # Cultural awareness scenarios
│   └── future/                   # Future-focused scenarios
│
├── models/                       # Model integration code
│   ├── openai.ts                 # OpenAI integration
│   ├── anthropic.ts              # Anthropic/Claude integration 
│   └── config.ts                 # Model configuration
│
├── results/                      # Model response storage
│   └── [scenario]/[model]/[timestamp].json
│
├── utils/                        # Utilities
│   ├── prompt-runner.ts          # Run prompts through models
│   └── result-formatter.ts       # Format results consistently
│
└── www/                          # Web application
```

## Prompt Format

Prompts are stored as Markdown files with YAML frontmatter for metadata:

```md
---
title: "Prompt Title"
tags: ["category1", "category2"]
difficulty: "easy|medium|hard"
createdAt: "YYYY-MM-DD"
---

# Prompt Title

Prompt content goes here...
```

## Adding a New Prompt

1. Create a new markdown file in the appropriate category directory
2. Include required frontmatter metadata
3. Write your prompt content

## Using the Prompt Runner

The prompt runner utility allows you to:

1. Parse prompt files
2. Run prompts through different AI models
3. Save and format the results

Example usage:

```typescript
import { runPrompt } from './utils/prompt-runner';

// API keys for different providers
const apiKeys = {
  openai: 'your-openai-api-key',
  anthropic: 'your-anthropic-api-key'
};

// Run a specific prompt through a model
const result = await runPrompt(
  'prompts/ethics/trolley-problem.md',
  'claude-3.5-sonnet',
  apiKeys
);

console.log(result);
```

## Using the CLI

Socius now includes a command-line interface for easier interaction:

```bash
# Run the CLI in interactive mode (default)
bun start

# Or run specific commands
bun run cli -- [command]

# If installed globally
socius [command]
```

The interactive mode provides a menu-driven interface that stays active until you choose to exit:

```bash
# Start interactive mode explicitly
bun run cli -- interactive

# Or simply (interactive is the default when no command is specified)
bun run cli
```

Available commands:

- `run`: Run a specific prompt or all prompts
  ```bash
  bun run cli -- run --prompt prompts/ethics/trolley-problem.md --model gpt-4
  bun run cli -- run --all --model gpt-4
  # Or use the interactive mode
  bun run cli -- run
  ```

- `list`: List all available prompts
  ```bash
  bun run cli -- list
  ```

- `models`: List all available models
  ```bash
  bun run cli -- models
  ```

- `check-keys`: Check if API keys are configured
  ```bash
  bun run cli -- check-keys
  ```

- `create`: Create a new prompt file
  ```bash
  bun run cli -- create
  ```

## Contributing

1. Choose a theme or topic aligned with the project philosophy
2. Create a new prompt in the appropriate category
3. Submit a pull request
