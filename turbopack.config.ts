// turbopack.config.js
const { defineConfig } = import('turbopack');

module.exports = defineConfig({
  // Specify the entry points
  entry: {
    main: 'app/page.tsx',
  },
  // Set the platform to 'node'
  platform: 'node',
  // Optionally, specify the target Node.js version
  target: 'node20',
  // Other configurations...
});