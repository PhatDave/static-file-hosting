import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/main.ts'],
    dts: false,
    splitting: false,
    sourcemap: false,
    outDir: 'build',
    clean: true,
    minify: true, // Minify could have issues with some package
    target: ['esnext'], // Change as per requirements
    format: ['cjs'] // Change as per requirements
});
