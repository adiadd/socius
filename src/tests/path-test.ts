/**
 * Test script for template path resolution
 */
import * as fs from 'fs';
import * as path from 'path';

// Test template path resolution
function testTemplatePath() {
  console.log("Current working directory:", process.cwd());

  const paths = [
    path.join(__dirname, '..', 'templates', 'prompt-template.md'),
    path.join(process.cwd(), 'templates', 'prompt-template.md'),
  ];

  console.log("\nChecking template paths:");
  for (const templatePath of paths) {
    try {
      fs.accessSync(templatePath, fs.constants.R_OK);
      console.log(`✅ Template found at: ${templatePath}`);
    } catch (error) {
      console.log(`❌ Template not found at: ${templatePath}`);
    }
  }

  // Test prompts directory path
  const promptsDir = path.join(__dirname, '..', 'prompts');
  try {
    const files = fs.readdirSync(promptsDir);
    console.log(`\n✅ Prompts directory found at: ${promptsDir}`);
    console.log(`Contains: ${files.join(', ')}`);

    // Try listing some subdirectories
    for (const file of files) {
      const filePath = path.join(promptsDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const subFiles = fs.readdirSync(filePath);
        console.log(`- ${file}/: ${subFiles.join(', ')}`);
      }
    }
  } catch (error) {
    console.log(`❌ Prompts directory not found at: ${promptsDir}`);
  }
}

// Run the test
testTemplatePath();