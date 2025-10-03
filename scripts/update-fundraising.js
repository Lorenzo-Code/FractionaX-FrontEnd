#!/usr/bin/env node

/**
 * Quick Fundraising Update Script
 * Run this script to quickly update fundraising progress
 * Usage: node scripts/update-fundraising.js [currentAmount] [investorCount]
 * 
 * Example: node scripts/update-fundraising.js 1250000 68
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node scripts/update-fundraising.js [currentAmount] [investorCount]');
  console.log('Example: node scripts/update-fundraising.js 1250000 68');
  process.exit(1);
}

const currentAmount = parseInt(args[0]);
const investorCount = parseInt(args[1]);
const updateNote = args[2] || 'Progress update';

if (isNaN(currentAmount) || isNaN(investorCount)) {
  console.log('Error: Amount and investor count must be numbers');
  process.exit(1);
}

// Path to the config file
const configPath = path.join(__dirname, '../src/data/fundraisingConfig.js');

try {
  // Read the current config file
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  // Update the values using regex replacement
  configContent = configContent.replace(
    /currentAmount: \d+,/,
    `currentAmount: ${currentAmount},`
  );
  
  configContent = configContent.replace(
    /investorCount: \d+,/,
    `investorCount: ${investorCount},`
  );
  
  // Update the last updated date
  const today = new Date().toISOString().split('T')[0];
  configContent = configContent.replace(
    /lastUpdated: '[^']*'/,
    `lastUpdated: '${today}'`
  );
  
  // Add to update history (insert before the closing bracket of updateHistory array)
  const newHistoryEntry = `    {
      date: '${today}',
      amount: ${currentAmount},
      investors: ${investorCount},
      note: '${updateNote}'
    },`;
  
  configContent = configContent.replace(
    /(updateHistory: \[\s*{[^}]*}\s*)(\/\/ Add new entries here)/,
    `$1${newHistoryEntry}
    $2`
  );
  
  // Write the updated config back
  fs.writeFileSync(configPath, configContent, 'utf8');
  
  console.log('✅ Fundraising progress updated successfully!');
  console.log(`📊 New amount: $${currentAmount.toLocaleString()}`);
  console.log(`👥 New investor count: ${investorCount}`);
  console.log(`📅 Updated on: ${today}`);
  console.log('');
  console.log('The investor page will now show the updated progress.');
  console.log('Remember to commit these changes to git!');
  
} catch (error) {
  console.error('Error updating fundraising config:', error.message);
  process.exit(1);
}