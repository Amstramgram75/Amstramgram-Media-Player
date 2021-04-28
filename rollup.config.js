import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const
  fs = require('fs-extra'),
  path = require('path'),
  appDirectory = 'src/',
  docs_srcDirectory = 'docs_src/js/',
  docs_devDirectory = 'docs_dev/js/',
  babelPropsESM = {
    babelHelpers: 'bundled',
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
    ]
  },
  babelPropsIIFE = Object.assign({
    presets: [
      [
        "@babel/preset-env",
        {
          "targets": "> 0.25%, not dead"
        }
      ]
    ],
  }, babelPropsESM)

function getExport(file, format) {
  let
    o = {},
    name = path.basename(file, path.extname(file))
  name = format == 'iife' ? name[0].toUpperCase() + name.slice(1) : ''
  o.input = `${appDirectory}js/${file}`
  o.output = [
    {
      format: format,
      file: `${docs_devDirectory}${format}/${file}`,
      name: name,
      // plugins: [
      //   terser({
      //     mangle: false,
      //   }),
      // ]
    }
  ]
  o.plugins = [
    babel(format == 'esm' ? babelPropsESM : babelPropsIIFE)
  ]
  return (o)
}

let myExports = []
const myFiles = ['amstramgramMediaPlayer.js', 'amstramgramAudioPlayer.js']
const myFormats = ['esm', 'iife']
myFiles.forEach(file => {
  myFormats.forEach(format => {
    myExports.push(getExport(file, format))
  })
})

const
  polyfillName = 'amstramgramMediaPlayerPolyfill',
  exportPolyfill = {
    input: `${appDirectory}js/${polyfillName}.js`,
    output: [
      {
        format: 'esm',
        file: `${docs_devDirectory}iife/${polyfillName}.min.js`,
        plugins: [
          terser(),
        ]
      },
    ],
  }

myExports.push(exportPolyfill)

//Build each js file found in the root of the docs_dev directory
fs.readdirSync(docs_srcDirectory)
  .filter(file => {
    return path.extname(file).toLowerCase() === '.js';
  })
  .forEach(file => {
    myExports.push({
      input: docs_srcDirectory + file,
      output: {
        file: docs_devDirectory + file,
      },
      plugins: [
        nodeResolve(),
        commonjs(),
        // terser(),
        babel({
          babelHelpers: 'bundled',
          "presets": [
            [
              "@babel/preset-env",
              { "targets": "> 0.25%, not dead, IE 11" },
            ],
          ],
        }),
      ]
    })
  });

export default myExports