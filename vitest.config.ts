import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/*.stories.{ts,tsx}',
        'src/examples/**',
        'src/models/**',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
      ],
    },
  },
});
