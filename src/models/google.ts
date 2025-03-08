/**
 * Implementation of Google's Gemini API integration
 */
import { ModelConfig } from './config';

/**
 * Run a prompt using Google's Gemini API
 * 
 * @param prompt The prompt text to send to the model
 * @param modelConfig Configuration for the model
 * @param apiKey The Google API key
 * @returns The response from the API
 */
export async function runGeminiPrompt(
    prompt: string,
    modelConfig: ModelConfig,
    apiKey: string
): Promise<any> {
    if (!apiKey) {
        throw new Error('Google API key is required');
    }

    try {
        // Import the Google Generative AI library dynamically to avoid issues
        // if it's not installed
        const { GoogleGenerativeAI } = await import('@google/generative-ai');

        // Initialize the Gemini API with your API key
        const genAI = new GoogleGenerativeAI(apiKey);

        // Get the model specified in the configuration
        const model = genAI.getGenerativeModel({
            model: modelConfig.version,
            generationConfig: {
                maxOutputTokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature,
            },
        });

        // Generate content based on the prompt
        const result = await model.generateContent(prompt);
        const response = result.response;

        // Create a formatted response object similar to other providers
        return {
            content: response.text(),
            usage: {
                // Gemini doesn't provide token counts in the same way as OpenAI
                // We'll return null values and the application can handle this appropriately
                input_tokens: null,
                output_tokens: null,
                total_tokens: null
            },
            model: modelConfig.version,
            // Add any additional response data as needed
            raw_response: response
        };
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
} 