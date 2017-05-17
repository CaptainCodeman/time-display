'use strict';

import * as path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-bower-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony';

export default {
  entry: 'index.js',
  dest: 'dist/time.min.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    resolve(),
    commonjs(),
    babel({
      presets: [
        //[ "es2015", { "modules": false } ]
        [ "es2016" ]
      ],
      plugins: [
        "external-helpers"
      ],
      runtimeHelpers: true,
      babelrc: false,
    }),
    // uglify()
    uglify({}, minify)
  ],
}
