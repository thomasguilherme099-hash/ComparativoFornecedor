#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Netlify build...');

try {
  // Install all dependencies including devDependencies
  console.log('Installing all dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build frontend
  console.log('Building frontend...');
  execSync('npx vite build --outDir dist/public --emptyOutDir', {
    stdio: 'inherit',
    cwd: resolve(__dirname, 'client'),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      DISABLE_REPLIT_PLUGINS: 'true'
    }
  });
  
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
