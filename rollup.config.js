/* eslint-disable @typescript-eslint/no-var-requires */
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = require('./package.json');

export default {
    input: 'src/index.ts',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ useTsconfigDeclarationDir: true }),
        babel({ babelHelpers: 'bundled' }),
        svgr(),
        visualizer(),
    ],
};
