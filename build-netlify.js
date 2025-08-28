#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Netlify build...');

function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const files = readdirSync(src);
  
  for (const file of files) {
    const srcPath = resolve(src, file);
    const destPath = resolve(dest, file);
    
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Create dist directory
  console.log('Creating build directories...');
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }
  if (!existsSync('dist/public')) {
    mkdirSync('dist/public', { recursive: true });
  }
  
  // Simple approach: Use esbuild to build everything
  console.log('Building frontend with esbuild...');
  execSync('npx esbuild client/src/main.tsx --bundle --outdir=dist/public --format=esm --target=es2020 --jsx=automatic --loader:.tsx=tsx --loader:.ts=ts --loader:.css=css --external:react --external:react-dom --define:process.env.NODE_ENV=\\"production\\"', {
    stdio: 'inherit'
  });
  
  // Copy HTML file
  console.log('Copying HTML file...');
  copyFileSync('client/index.html', 'dist/public/index.html');
  
  // Copy assets if they exist
  if (existsSync('attached_assets')) {
    console.log('Copying assets...');
    copyDir('attached_assets', 'dist/public/assets');
  }
  
  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit'
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
