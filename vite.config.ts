import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: {
      clientPort: 3000,
    },
  },
  plugins: [react()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@radix-ui\/.*/,
        'clsx',
        'react-icons',
        'commander',
        'prompts',
        'fs',
        'path',
        'child_process',
        'url',
      ],
    },
  },
})
