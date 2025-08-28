#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

console.log('🚀 Starting Netlify build...');

function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed!`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

try {
  // Install dependencies
  runCommand('npm install', 'Installing dependencies');
  
  // Create dist directory
  console.log('📁 Creating build directories...');
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }
  if (!existsSync('dist/public')) {
    mkdirSync('dist/public', { recursive: true });
  }
  
  // Build CSS with Tailwind
  runCommand('npx tailwindcss -i client/src/index.css -o dist/public/main.css --config tailwind.config.netlify.js --minify', 'Building CSS with Tailwind');
  
  // Build frontend with esbuild
  runCommand('npx esbuild client/src/main.tsx --bundle --outfile=dist/public/main.js --format=iife --target=es2020 --jsx=automatic --define:process.env.NODE_ENV=\\"production\\"', 'Building frontend JavaScript');
  
  // Create HTML file
  console.log('📄 Creating HTML file...');
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PaintCompare - Comparador de Preços de Tintas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="/main.js"></script>
  </body>
</html>`;

  writeFileSync('dist/public/index.html', html);
  console.log('✅ HTML file created!');
  
  // Build backend
  runCommand('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', 'Building backend');
  
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('💥 Build failed:', error.message);
  process.exit(1);
}
