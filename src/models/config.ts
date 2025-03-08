/**
 * Configuration file for AI model settings
 */
import { MessageCreateParams } from '@anthropic-ai/sdk/resources';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';
// Note: Google Generative AI doesn't export model names as types

// Base model configuration shared by all providers
interface BaseModelConfig {
    name: string;
    maxTokens: number;
    temperature: number;
    apiEndpoint?: string;
}

// Provider-specific model configurations
export interface OpenAIModelConfig extends BaseModelConfig {
    provider: 'OpenAI';
}

export interface AnthropicModelConfig extends BaseModelConfig {
    provider: 'Anthropic';
}

export interface GoogleModelConfig extends BaseModelConfig {
    provider: 'Google';
}

// Union type for all model configurations
export type ModelConfig = OpenAIModelConfig | AnthropicModelConfig | GoogleModelConfig;

// Define types from the SDKs
export type OpenAIModelId = ChatCompletionCreateParamsNonStreaming['model'];
export type AnthropicModelId = MessageCreateParams['model'];
export type GoogleModelId = 'gemini-2.0-flash' | 'gemini-2.0-flash-lite' | 'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro';

// Unified model ID type that includes all supported models
export type ModelId = OpenAIModelId | AnthropicModelId | GoogleModelId;

// Type guards to check provider types
export function isOpenAIConfig(config: ModelConfig): config is OpenAIModelConfig {
    return config.provider === 'OpenAI';
}

export function isAnthropicConfig(config: ModelConfig): config is AnthropicModelConfig {
    return config.provider === 'Anthropic';
}

export function isGoogleConfig(config: ModelConfig): config is GoogleModelConfig {
    return config.provider === 'Google';
}

// Helper to determine the provider from a model ID
export function getProviderFromModelId(modelId: ModelId): 'OpenAI' | 'Anthropic' | 'Google' {
    // OpenAI models typically start with "gpt-"
    if (modelId.toString().startsWith('gpt-')) {
        return 'OpenAI';
    }
    // Anthropic models contain "claude"
    else if (modelId.toString().includes('claude')) {
        return 'Anthropic';
    }
    // Google models contain "gemini"
    else if (modelId.toString().includes('gemini')) {
        return 'Google';
    }
    // Default fallback - should add validation in production
    else {
        throw new Error(`Unknown model ID provider: ${modelId}`);
    }
}

// Model configurations defined using the SDK model IDs directly
export const modelConfigs: Record<string, ModelConfig> = {
    // OpenAI Models
    "gpt-4-turbo-preview": {
        name: "GPT-4 Turbo",
        provider: "OpenAI",
        maxTokens: 4000,
        temperature: 0.7
    },
    "gpt-4": {
        name: "GPT-4",
        provider: "OpenAI",
        maxTokens: 4000,
        temperature: 0.7
    },
    "gpt-3.5-turbo": {
        name: "GPT-3.5 Turbo",
        provider: "OpenAI",
        maxTokens: 4000,
        temperature: 0.7
    },

    // Anthropic Models
    "claude-3-5-sonnet-latest": {
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        maxTokens: 4000,
        temperature: 0.7
    },
    "claude-3-opus": {
        name: "Claude 3 Opus",
        provider: "Anthropic",
        maxTokens: 4000,
        temperature: 0.7
    },
    "claude-3-sonnet": {
        name: "Claude 3 Sonnet",
        provider: "Anthropic",
        maxTokens: 4000,
        temperature: 0.7
    },
    "claude-3-haiku": {
        name: "Claude 3 Haiku",
        provider: "Anthropic",
        maxTokens: 4000,
        temperature: 0.7
    },

    // Google Models
    "gemini-2.0-flash": {
        name: "Gemini 2.0 Flash",
        provider: "Google",
        maxTokens: 2048,
        temperature: 0.7
    },
    "gemini-pro": {
        name: "Gemini Pro",
        provider: "Google",
        maxTokens: 2048,
        temperature: 0.7
    },
    "gemini-pro-vision": {
        name: "Gemini Pro Vision",
        provider: "Google",
        maxTokens: 2048,
        temperature: 0.7
    }
};

// Default model if none specified
export const defaultModel: ModelId = "gpt-4-turbo-preview";

// Export model IDs for easy access
export const modelIds = Object.keys(modelConfigs) as ModelId[]; 