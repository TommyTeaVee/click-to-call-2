import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import multiEntry from 'rollup-plugin-multi-entry'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import url from 'rollup-plugin-url'
import visualizer from 'rollup-plugin-visualizer'
import path from 'path'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  input: './src/c2c.ts',
  output: {
    file: isDev ? 'dist/c2c.js' : 'dist/c2c.min.js',
    format: 'iife'
  },
  plugins: [
    visualizer(),
    multiEntry({ exports: false }),
    url({
      limit: 50 * 1024,
      publicPath: '/assets',
      fileName: '[name][extname]',
      include: [
        '**/*.jpg',
        '**/*.svg',
        '**/*.png',
        '**/*.css',
        '**/*.eot',
        '**/*.ttf',
        '**/*.woff',
        '**/*.wav'
      ],
      destDir: path.join(__dirname, 'dist/assets')
    }),
    resolve({
      browser: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    json({
      include: 'node_modules/**'
    }),
    globals(),
    builtins(),
    typescript(),
    !isDev && terser(),
    ...(isDev
      ? [
          livereload(),
          serve({
            open: 'true',
            contentBase: path.resolve(__dirname),
            host: 'localhost',
            port: 8080,
            openPage: '/'
          })
        ]
      : [])
  ]
}
