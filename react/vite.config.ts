import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.build.json',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ForjedInertiaTableReact',
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                '@inertiajs/react',
                '@tanstack/react-table',
                'ziggy-js',
            ],
            output: [
                {
                    format: 'es',
                    dir: 'dist',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'jsxRuntime',
                        '@inertiajs/react': 'InertiaReact',
                        'ziggy-js': 'route',
                    },
                },
                {
                    format: 'cjs',
                    dir: 'dist',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].cjs',
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        'react/jsx-runtime': 'jsxRuntime',
                        '@inertiajs/react': 'InertiaReact',
                        'ziggy-js': 'route',
                    },
                },
            ],
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [],
    },
});
