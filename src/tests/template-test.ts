/**
 * Test script for prompt template functionality
 */
import * as path from 'path';
import { applyPromptTemplate, parsePromptFile } from '../utils/prompt-runner';

// Test the template functionality
async function testTemplate() {
  try {
    // Load a sample prompt
    const promptPath = path.join(process.cwd(), 'prompts', 'ethics', 'trolley-problem.md');
    // Alternatively, using __dirname for relative path resolution
    // const promptPath = path.join(__dirname, '..', 'prompts', 'ethics', 'trolley-problem.md');
    const promptContent = parsePromptFile(promptPath);

    console.log("Original prompt content:");
    console.log("------------------------");
    console.log(promptContent.content);
    console.log("\n");

    // Apply the template
    const formattedPrompt = applyPromptTemplate(promptContent);

    console.log("Formatted prompt with template:");
    console.log("------------------------------");
    console.log(formattedPrompt);

    console.log("\nTemplate application successful!");
  } catch (error) {
    console.error("Error testing template:", error);
  }
}

// Run the test
testTemplate();