/**
 * Anthropic Claude model integration
 */
import { ModelConfig } from './config';

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
    apiKey: string
): Promise<ClaudeResponse> {
    // Skip implementation if no API key is provided
    if (!apiKey) {
        throw new Error('Anthropic API key is required');
    }

    const url = 'https://api.anthropic.com/v1/messages';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: modelConfig.version,
                system: 'You are an AI assistant analyzing human-centered scenarios.',
                messages: [
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
            throw new Error(`Anthropic API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        throw error;
    }
} 