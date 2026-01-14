import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: 'src/styles/main.css',
            output: {
                assetFileNames: 'style.css',
                entryFileNames: 'script.js'
            }
        }
    },
    server: {
        watch: {
            usePolling: true
        }
    }
});
