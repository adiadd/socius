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
    "claude-3": {
        name: "Claude 3 Opus",
        provider: "Anthropic",
        version: "claude-3-opus-20240229",
        maxTokens: 4000,
        temperature: 0.7
    },
    "gemini-pro": {
        name: "Gemini Pro",
        provider: "Google",
        version: "gemini-pro",
        maxTokens: 2048,
        temperature: 0.7
    }
};

// Default model if none specified
export const defaultModel = "gpt-4";

// Export model IDs for easy access
export const modelIds = Object.keys(modelConfigs); 