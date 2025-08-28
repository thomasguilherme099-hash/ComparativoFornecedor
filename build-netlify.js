#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

console.log('🚀 Starting optimized Netlify build...');

function runCommand(command, description) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'pipe', maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer
    console.log(`✅ ${description} completed!`);
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
  
  // Build CSS with Tailwind (minified for production)
  runCommand('npx tailwindcss -i client/src/index.css -o dist/public/main.css --config tailwind.config.netlify.js --minify', 'Building CSS with Tailwind');
  
  // Build frontend with esbuild (optimized)
  runCommand('npx esbuild client/src/main.tsx --bundle --outfile=dist/public/main.js --format=iife --target=es2020 --jsx=automatic --minify --tree-shaking=true --define:process.env.NODE_ENV=\\"production\\"', 'Building optimized frontend JavaScript');
  
  // Create HTML file
  console.log('📄 Creating HTML file...');
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PaintCompare - Comparador de Preços de Tintas</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/main.css">
    <style>
      :root {
        --background: hsl(210, 11%, 97%);
        --foreground: hsl(215, 25%, 27%);
        --primary: hsl(217, 91%, 35%);
        --secondary: hsl(159, 65%, 38%);
        --accent: hsl(28, 86%, 53%);
        --chart-1: hsl(217, 91%, 35%);
        --chart-2: hsl(159, 65%, 38%);
        --chart-3: hsl(28, 86%, 53%);
        --chart-4: hsl(147, 78%, 42%);
        --chart-5: hsl(341, 75%, 51%);
        --sidebar: hsl(0, 0%, 100%);
        --sidebar-primary: hsl(217, 91%, 35%);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="/main.js"></script>
  </body>
</html>`;

  writeFileSync('dist/public/index.html', html);
  console.log('✅ HTML file created!');
  
  console.log('🎉 Optimized build completed successfully!');
} catch (error) {
  console.error('💥 Build failed:', error.message);
  process.exit(1);
}
