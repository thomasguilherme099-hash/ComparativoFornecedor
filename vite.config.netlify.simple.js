import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  plugins: [
    {
      name: 'react',
      config() {
        return {
          esbuild: {
            loader: 'tsx',
            include: /\.(tsx?|jsx?)$/,
            target: 'es2020'
          }
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "client", "src"),
      "@shared": resolve(__dirname, "shared"),
      "@assets": resolve(__dirname, "attached_assets"),
    },
  },
  root: resolve(__dirname, "client"),
  build: {
    outDir: resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "client/index.html")
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
}
