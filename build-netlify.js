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
        --card: hsl(0, 0%, 100%);
        --card-foreground: hsl(215, 25%, 27%);
        --popover: hsl(0, 0%, 100%);
        --popover-foreground: hsl(215, 25%, 27%);
        --primary: hsl(217, 91%, 35%);
        --primary-foreground: hsl(0, 0%, 98%);
        --secondary: hsl(159, 65%, 38%);
        --secondary-foreground: hsl(0, 0%, 98%);
        --muted: hsl(214, 13%, 92%);
        --muted-foreground: hsl(215, 16%, 47%);
        --accent: hsl(28, 86%, 53%);
        --accent-foreground: hsl(0, 0%, 98%);
        --destructive: hsl(0, 72%, 51%);
        --destructive-foreground: hsl(0, 0%, 98%);
        --border: hsl(214, 13%, 92%);
        --input: hsl(214, 13%, 92%);
        --ring: hsl(217, 91%, 35%);
        --chart-1: hsl(217, 91%, 35%);
        --chart-2: hsl(159, 65%, 38%);
        --chart-3: hsl(28, 86%, 53%);
        --chart-4: hsl(147, 78%, 42%);
        --chart-5: hsl(341, 75%, 51%);
        --sidebar: hsl(0, 0%, 100%);
        --sidebar-foreground: hsl(215, 25%, 27%);
        --sidebar-primary: hsl(217, 91%, 35%);
        --sidebar-primary-foreground: hsl(0, 0%, 98%);
        --sidebar-accent: hsl(214, 13%, 92%);
        --sidebar-accent-foreground: hsl(215, 25%, 27%);
        --sidebar-border: hsl(214, 13%, 92%);
        --sidebar-ring: hsl(217, 91%, 35%);
        --radius: 0.5rem;
      }
      .dark {
        --background: hsl(224, 71%, 4%);
        --foreground: hsl(213, 31%, 91%);
        --sidebar: hsl(224, 71%, 4%);
        --sidebar-foreground: hsl(213, 31%, 91%);
        --sidebar-primary: hsl(224, 76%, 78%);
        --sidebar-primary-foreground: hsl(222.2, 47.4%, 1.2%);
        --sidebar-accent: hsl(216, 34%, 17%);
        --sidebar-accent-foreground: hsl(210, 40%, 98%);
        --sidebar-border: hsl(216, 34%, 17%);
        --sidebar-ring: hsl(224, 76%, 78%);
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
