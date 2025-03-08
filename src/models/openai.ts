/**
 * OpenAI model integration
 */
import { ModelConfig } from './config';

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
    apiKey: string
): Promise<OpenAIResponse> {
    // Skip implementation if no API key is provided
    if (!apiKey) {
        throw new Error('OpenAI API key is required');
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelConfig.version,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI assistant analyzing human-centered scenarios.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
} 