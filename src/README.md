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

## Contributing

1. Choose a theme or topic aligned with the project philosophy
2. Create a new prompt in the appropriate category
3. Submit a pull request
