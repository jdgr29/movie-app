/// <reference types="vitest" />

export default {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // reporters: ['default', 'html'], // Temporarily remove 'html' reporter
    reporters: ['default'], // Use only default reporter
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], // Keep coverage reporters for now
    },
  },
};
