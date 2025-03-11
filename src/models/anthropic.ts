/**
 * Anthropic Claude model integration
 */
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';
import { AnthropicModelId, isAnthropicConfig, ModelConfig } from './config';

export interface ClaudeResponse {
    id: string;
    type: string;
    role: string;
    content: {
        type: string;
        text: string;
    }[];
    model: string;
    stop_reason: string;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

export async function runClaudePrompt(
    prompt: string,
    modelConfig: ModelConfig,
    modelId: AnthropicModelId,
    apiKey: string
): Promise<ClaudeResponse> {
    // Skip implementation if no API key is provided
    if (!apiKey) {
        throw new Error('Anthropic API key is required');
    }

    // Ensure we have an Anthropic model config
    if (!isAnthropicConfig(modelConfig)) {
        throw new Error(`Invalid model configuration for Anthropic: ${modelConfig.provider}`);
    }

    try {
        const anthropic = new Anthropic({
            apiKey: apiKey,
        });

        const messages: MessageParam[] = [
            {
                role: 'user',
                content: prompt
            }
        ];

        const response = await anthropic.messages.create({
            model: modelId,
            messages: messages,
            max_tokens: modelConfig.maxTokens,
            temperature: modelConfig.temperature
        });

        // Convert SDK response to our interface format
        return {
            id: response.id,
            type: response.type,
            role: response.role,
            content: response.content
                .filter(block => block.type === 'text')
                .map(block => ({
                    type: block.type,
                    text: 'text' in block ? block.text : ''
                })),
            model: response.model,
            stop_reason: response.stop_reason || '',
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens
            }
        };
    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        throw error;
    }
} 