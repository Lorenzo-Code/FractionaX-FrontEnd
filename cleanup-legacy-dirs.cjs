#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories to remove (legacy structure)
const legacyDirectories = [
  'src/components',
  'src/pages', 
  'src/utils',
  'src/hooks',
  'src/api',
  'src/config'
];

// Function to safely remove directory
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing legacy directory: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${dirPath}`);
  } else {
    console.log(`Directory not found (already removed): ${dirPath}`);
  }
}

console.log('Starting cleanup of legacy directory structure...\n');

// Remove each legacy directory
legacyDirectories.forEach(dir => {
  removeDirectory(dir);
});

console.log('\n✅ Legacy directory cleanup completed!');
console.log('\nRemaining structure should include:');
console.log('- src/features/ (new feature-based organization)');
console.log('- src/shared/ (shared components, hooks, utils)');
console.log('- src/components/ (if any new UI components exist)');
console.log('- Other essential files and directories');

console.log('\nYour project now has a clean, modern structure! 🎉');
