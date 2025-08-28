#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';

console.log('🚀 Starting SUPER SIMPLE Netlify build...');

function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    const result = execSync(command, { stdio: 'pipe', maxBuffer: 1024 * 1024 * 10 });
    console.log(`✅ ${description} completed!`);
    return result.toString();
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

try {
  // Create dist directory
  console.log('📁 Creating build directories...');
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }
  if (!existsSync('dist/public')) {
    mkdirSync('dist/public', { recursive: true });
  }
  
  // Generate full CSS with Tailwind
  console.log('📦 Building FULL CSS with all variables...');
  runCommand('npx tailwindcss -i client/src/index.css -o dist/public/main.css --config tailwind.config.netlify.js', 'Building CSS with Tailwind');
  
  // Read the generated CSS
  const cssContent = readFileSync('dist/public/main.css', 'utf8');
  
  // Build frontend with esbuild (smaller bundle)
  runCommand('npx esbuild client/src/main.tsx --bundle --outfile=dist/public/main.js --format=iife --target=es2020 --jsx=automatic --minify --define:process.env.NODE_ENV=\\"production\\"', 'Building optimized frontend JavaScript');
  
  // Create HTML file with FULL CSS inline
  console.log('📄 Creating HTML file with FULL inline CSS...');
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PaintCompare - Comparador de Preços de Tintas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      ${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="/main.js"></script>
  </body>
</html>`;

  writeFileSync('dist/public/index.html', html);
  console.log('✅ HTML file with FULL inline CSS created!');
  
  // Remove external CSS file since everything is inline
  console.log('🧹 Cleaning up external CSS file...');
  try { execSync('rm dist/public/main.css'); } catch {}
  
  console.log('🎉 SUPER SIMPLE build completed successfully!');
  console.log('📊 All CSS is now INLINE in HTML - guaranteed to work!');
} catch (error) {
  console.error('💥 Build failed:', error.message);
  process.exit(1);
}
