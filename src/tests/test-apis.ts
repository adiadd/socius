/**
 * Test file for checking API integrations
 */
import * as dotenv from 'dotenv';
import { runClaudePrompt } from '../models/anthropic';
import { modelConfigs } from '../models/config';
import { runGeminiPrompt } from '../models/google';
import { runOpenAIPrompt } from '../models/openai';

// Load environment variables
dotenv.config();

const apiKeys = {
    openai: process.env.OPENAI_API_KEY || '',
    anthropic: process.env.ANTHROPIC_API_KEY || '',
    google: process.env.GOOGLE_API_KEY || '',
};

async function testAPIs() {
    const testPrompt = "What's the capital of France?";
    console.log("Testing APIs with prompt:", testPrompt);

    // Test OpenAI
    if (apiKeys.openai) {
        try {
            console.log("Testing OpenAI API...");
            const openaiResponse = await runOpenAIPrompt(
                testPrompt,
                modelConfigs["gpt-4"],
                "gpt-4",
                apiKeys.openai
            );
            console.log("OpenAI Response:",
                openaiResponse.choices[0]?.message?.content || "No response content");
            console.log("OpenAI Tokens:", openaiResponse.usage);
        } catch (error) {
            console.error("OpenAI API Error:", error);
        }
    } else {
        console.log("Skipping OpenAI test (no API key provided)");
    }

    // Test Anthropic
    if (apiKeys.anthropic) {
        try {
            console.log("\nTesting Anthropic API...");
            const claudeResponse = await runClaudePrompt(
                testPrompt,
                modelConfigs["claude-3-5-sonnet-latest"],
                "claude-3-5-sonnet-latest",
                apiKeys.anthropic
            );
            console.log("Claude Response:",
                claudeResponse.content[0]?.text || "No response content");
            console.log("Claude Tokens:", claudeResponse.usage);
        } catch (error) {
            console.error("Anthropic API Error:", error);
        }
    } else {
        console.log("Skipping Anthropic test (no API key provided)");
    }

    // Test Google
    if (apiKeys.google) {
        try {
            console.log("\nTesting Google API...");
            const geminiResponse = await runGeminiPrompt(
                testPrompt,
                modelConfigs["gemini-2.0-flash"],
                "gemini-2.0-flash",
                apiKeys.google
            );
            console.log("Gemini Response:",
                geminiResponse.content || "No response content");
            console.log("Gemini Tokens:", geminiResponse.usage);
        } catch (error) {
            console.error("Google API Error:", error);
        }
    } else {
        console.log("Skipping Google test (no API key provided)");
    }
}

testAPIs().catch(console.error); 