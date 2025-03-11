/**
 * Test script for file structure
 */
import * as path from 'path';
import * as fs from 'fs';

// Test project structure
function testStructure() {
  console.log("Testing project structure...\n");
  
  const expectedDirectories = [
    path.join(__dirname, '..', 'templates'),
    path.join(__dirname, '..', 'prompts'),
    path.join(__dirname, '..', 'results'),
    path.join(__dirname, '..', 'models'),
    path.join(__dirname, '..', 'utils')
  ];
  
  const expectedFiles = [
    path.join(__dirname, '..', 'templates', 'prompt-template.md'),
    path.join(__dirname, '..', 'prompts', 'ethics', 'trolley-problem.md'),
    path.join(__dirname, '..', 'prompts', 'society', 'universal-basic-income.md')
  ];
  
  // Check directories
  console.log("Checking required directories:");
  expectedDirectories.forEach(dir => {
    try {
      const stats = fs.statSync(dir);
      if (stats.isDirectory()) {
        console.log(`✅ ${dir}`);
      } else {
        console.log(`❌ ${dir} exists but is not a directory`);
      }
    } catch (error) {
      console.log(`❌ ${dir} does not exist`);
    }
  });
  
  // Check files
  console.log("\nChecking required files:");
  expectedFiles.forEach(file => {
    try {
      const stats = fs.statSync(file);
      if (stats.isFile()) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} exists but is not a file`);
      }
    } catch (error) {
      console.log(`❌ ${file} does not exist`);
    }
  });
  
  // Final report
  console.log("\nDirectory structure test complete.");
}

// Run the test
testStructure();