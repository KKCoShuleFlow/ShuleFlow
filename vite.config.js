import checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
    react(),
    checker({
      // this will surface path/casing errors
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx}"'
      }
    })
  ]
})