/**
 * OpenAI model integration
 */
import OpenAI from 'openai';
import { isOpenAIConfig, ModelConfig, OpenAIModelId } from './config';

export interface OpenAIResponse {
    id: string;
    model: string;
    created: number;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function runOpenAIPrompt(
    prompt: string,
    modelConfig: ModelConfig,
    modelId: OpenAIModelId,
    apiKey: string
): Promise<OpenAIResponse> {
    // Skip implementation if no API key is provided
    if (!apiKey) {
        throw new Error('OpenAI API key is required');
    }

    // Ensure we have an OpenAI model config
    if (!isOpenAIConfig(modelConfig)) {
        throw new Error(`Invalid model configuration for OpenAI: ${modelConfig.provider}`);
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: modelConfig.maxTokens,
            temperature: modelConfig.temperature
        });

        // Convert SDK response to our interface format
        return {
            id: response.id,
            model: response.model,
            created: response.created,
            choices: response.choices.map(choice => ({
                index: choice.index,
                message: {
                    role: choice.message.role,
                    content: choice.message.content || ''
                },
                finish_reason: choice.finish_reason || ''
            })),
            usage: response.usage || {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0
            }
        };
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
} 