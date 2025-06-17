import {defineConfig, Options} from 'tsup';

export default defineConfig(options => {
    const commonOptions: Partial<Options> = {
        entry: {
            protobufGenerator: 'src/index.ts',
        },
        sourcemap: true,
        ...options,
    };

    return [
        {
            ...commonOptions,
            format: ['esm'],
            target: 'es2019',
            outExtension: () => ({js: '.mjs'}),
            dts: true,
            clean: true,
        },
        {
            ...commonOptions,
            format: 'cjs',
            outDir: './dist/cjs/',
            outExtension: () => ({js: '.cjs'}),
        },
    ];
});
