import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      'components': '/src/components',
      'pages': '/src/pages',
      'store': '/src/store',
      'utils': '/src/utils',
      'assets': '/src/assets',
      'hooks': '/src/hooks',
      'types': '/src/types',
      'styles': '/src/styles',
      'api': '/src/api',
      'config': '/src/config',
      'context': '/src/context',
      'services': '/src/services',
      'constants': '/src/constants',
      'middleware': '/src/middleware',
      'lib': '/src/lib',
      'features': '/src/features',
      'tests': '/src/tests',
      'locales': '/src/locales',
      'theme': '/src/theme',
      'navigation': '/src/navigation',
      'models': '/src/models',
    }
  }
})
