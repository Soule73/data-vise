import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { plugin as markdown } from 'vite-plugin-markdown'
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    markdown()
  ],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@styles": path.resolve(__dirname, './src/styles'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@store': path.resolve(__dirname, './src/core/store'),
      '@utils': path.resolve(__dirname, './src/core/utils'),
      '@assets': path.resolve(__dirname, './src/core/assets'),
      '@hooks': path.resolve(__dirname, './src/core/hooks'),
      '@type': path.resolve(__dirname, './src/core/types'),
      '@constants': path.resolve(__dirname, './src/core/constants'),
      '@services': path.resolve(__dirname, './src/data/services'),
      '@repositories': path.resolve(__dirname, './src/data/repositories'),
      '@adapters': path.resolve(__dirname, './src/data/adapters'),
      '@validation': path.resolve(__dirname, './src/core/validation'),
      '@data': path.resolve(__dirname, './src/data'),
    }
  }
})
