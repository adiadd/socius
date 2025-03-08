/**
 * Configuration file for AI model settings
 */

export interface ModelConfig {
    name: string;
    provider: string;
    version: string;
    maxTokens: number;
    temperature: number;
    apiEndpoint?: string;
}

export const modelConfigs: Record<string, ModelConfig> = {
    "gpt-4": {
        name: "GPT-4",
        provider: "OpenAI",
        version: "gpt-4-turbo-preview",
        maxTokens: 4000,
        temperature: 0.7
    },
    "claude-3.5-sonnet": {
        name: "Claude 3 Opus",
        provider: "Anthropic",
        version: "claude-3-5-sonnet-latest",
        maxTokens: 4000,
        temperature: 0.7
    },
    "gemini-2.0-flash": {
        name: "Gemini 2.0 Flash",
        provider: "Google",
        version: "gemini-2.0-flash",
        maxTokens: 2048,
        temperature: 0.7
    }
};

// Default model if none specified
export const defaultModel = "gpt-4";

// Export model IDs for easy access
export const modelIds = Object.keys(modelConfigs); 