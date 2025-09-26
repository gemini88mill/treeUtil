#!/usr/bin/env node

// Simple test script to verify the build process
console.log('Testing build process...');

// Check if pkg is available
try {
  const pkg = require('pkg');
  console.log('✓ pkg is available');
} catch (error) {
  console.log('✗ pkg not found - run npm install first');
  process.exit(1);
}

// Check if dist directory exists
const fs = require('fs');
const path = require('path');

if (fs.existsSync('dist/src/cli.js')) {
  console.log('✓ Compiled CLI exists');
} else {
  console.log('✗ Compiled CLI not found - run bun run build first');
  process.exit(1);
}

console.log('✓ Build environment is ready');
console.log('\nTo build standalone executables:');
console.log('  bun run build:win     # Windows');
console.log('  bun run build:linux   # Linux');
console.log('  bun run build:macos   # macOS');
console.log('  bun run build:all     # All platforms');
