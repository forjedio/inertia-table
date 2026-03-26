import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.build.json',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ForjedInertiaTableVue',
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'cjs' ? 'index.cjs' : 'index.js'),
        },
        rollupOptions: {
            external: [
                'vue',
                '@inertiajs/vue3',
                'ziggy-js',
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    '@inertiajs/vue3': 'InertiaVue3',
                    'ziggy-js': 'route',
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
