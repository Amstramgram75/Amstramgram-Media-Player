import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"

const
  fs = require('fs-extra'),
  path = require('path'),
  nodeModules = './node_modules/.bin/',
  srcFolder = 'src',
  distFolder = 'dist',
  docs_srcFolder = 'docs_src',
  docsFolder = 'docs',
  done = '\x1b[32mDONE !!!\n'

function getBanner(str, min = false) {
  /**
   * bannerInfos = "
   *    @version : 0.1.0
   *    @licence : MIT
   *    @author : Amstramgram
   *    @url : https:/amp./onfaitdessites.fr/
   * "
   */
  const bannerInfos = `
  @version : ${process.env.npm_package_version}
  @licence : ${process.env.npm_package_license}
  @author : ${process.env.npm_package_author_name}
  @url : ${process.env.npm_package_homepage}`,
    bannerInfosMin = `--@version:${process.env.npm_package_version}--@licence:${process.env.npm_package_license}--@url:${process.env.npm_package_homepage}`
  let banner
  if (min) {
    banner = `/*${str}${bannerInfosMin}*/`
  } else {
    banner = `/****************************************
  ${str}${bannerInfos}
****************************************/\n\n`
  }
  return banner
}

function getMinName(file){
  const a = file.split('.')
  return a[0] + '.min.' + a[1]
}


//Empty dist folder
console.log(`\x1b[33mEmptying the ${distFolder} folder`)
fs.emptyDirSync(distFolder)
console.log(done)

//Empty doc folder
console.log(`\x1b[33mEmptying the ${docsFolder} folder`)
fs.emptyDirSync(docsFolder)
console.log(done)

//Copy README.md to dist/
console.log(`\x1b[33mCopying README.md to the ${distFolder} folder`)
fs.copySync('README.md', `${distFolder}/README.md`)
console.log(done)

//Copy src folder content to dist/src
console.log(`\x1b[33mCopying ${srcFolder} folder to the ${distFolder}/src folder`)
fs.copySync(srcFolder, `${distFolder}/src`)
console.log(done)

//Copy minified version of highlight9.18.5 and its polyfills for IE11 
//from docs_src/js/polyfill to doc/js/polyfill 
console.log('\x1b[33mCopying highlight polyfills for IE11 to doc/js/polyfill')
fs.copySync(`${docs_srcFolder}/js/polyfill`, `${docsFolder}/js/polyfill`, {
  filter:
    src => {
      //For the first two pass, src == `docs_src/js/polyfill`
      return (src.endsWith('.min.js') || src == `${docs_srcFolder}/js/polyfill`)
    }
  }
)
console.log(done)

//Create dist/package.json
console.log(`\x1b[33mCreating ${distFolder}/package.json`)
//Copy package.json to dist
fs.copySync(`package.json`, `${distFolder}/package.json`)
//Remove scripts and devDependencies keys from dist/package.json
const file = require("edit-json-file")(`${distFolder}/package.json`)
file.unset('scripts')
file.unset('devDependencies')
file.save()
console.log(done)

const exec = require('child_process').execSync

//Compile and minify src sass files to dist/css
console.log(`\x1b[33mCompiling and minifying SASS from ${srcFolder}/scss to ${distFolder}/css folder`)
exec(`"${nodeModules}sass" --style=compressed --no-source-map ${srcFolder}/scss:${distFolder}/css`)
console.log(done)

//Renaming css files to .min.css
console.log(`\x1b[33mRenaming minified css files in ${distFolder}/css folder`)
fs.readdirSync(`${distFolder}/css`).forEach(file=>{
  fs.renameSync(`${distFolder}/css/${file}`, `${distFolder}/css/${getMinName(file)}`)
  console.log(`${distFolder}/css/${file} renamed to ${distFolder}/css/${getMinName(file)}`)
})
console.log(done)


//Compile src sass files to dist/css
console.log(`\x1b[33mCompiling SASS from ${srcFolder}/scss to ${distFolder}/css folder`)
exec(`"${nodeModules}sass" --no-source-map ${srcFolder}/scss:${distFolder}/css`)
console.log(done)

//Prepend banner to dist/css files
console.log(`\x1b[33mAdding banner to ${distFolder}/css files`)
const prependFile = require('prepend-file').sync
fs.readdirSync(`${distFolder}/css/`).forEach(file => {
  prependFile(`${distFolder}/css/${file}`, getBanner(file, file.endsWith('.min.css')))
  console.log(`${distFolder}/css/${file} updated with banner`)
  if (file.endsWith('.min.css')) {
    fs.copySync(`${distFolder}/css/${file}`,`${docsFolder}/css/${file}`)
    console.log(`${distFolder}/css/${file} copied to ${docsFolder}/css/`)
  }
})
console.log(done)

//Compile and minify SASS files from docs_src/css folder to doc/css folder
console.log(`\x1b[33mCompiling and minifying SASS from ${docs_srcFolder}/scss folder to ${docsFolder}/css folder`)
exec(`"${nodeModules}sass" --style=compressed --no-source-map ${docs_srcFolder}/scss:${docsFolder}/css`)
console.log(done)

//Compile and minify docs_src html files in doc folder
console.log(`\x1b[33mCompiling ${docs_srcFolder} HTML files to ${docsFolder} folder`)
exec(`"${nodeModules}posthtml" -c .posthtmlrc_build`)
console.log(done)



/* -------------------------------------------------------------------------- */
/*                               ROLLUP BUILDING                              */
/* -------------------------------------------------------------------------- */
console.log('\x1b[33mROLLUP BEGINS...!!!')

/**
 * @param {*} options : object with src and dest keys
 * @description : 
 * Micro rollup copy plugin
 * src is the file path to copy
 * dest is the folder where src is copied
 */
const copyFile = (options = {}) => {
  const { src = '', dest = '' } = options
  return {
    writeBundle() {
      fs.copySync(src, path.join(dest, path.basename(src)))
      console.log(`\x1b[33m${src} has been copied to ${dest}`)
    }
  }
}

const
  babelPropsESM = {
    babelHelpers: 'bundled',
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
    ]
  },
  babelPropsCommon = Object.assign({
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
  o.input = `${srcFolder}/js/${file}`
  o.output = [
    {
      format: format,
      file: `${distFolder}/${format}/${file}`,
      banner: getBanner(file),
      name: name
    }
  ]
  if (format != 'cjs') {
    const outputMin = {
      format: format,
      file: `${distFolder}/${format}/${getMinName(file)}`,
      banner: getBanner(file, true),
      name: name,
      plugins: [
        terser({
          mangle: false,
        }),
        copyFile({ src: `${distFolder}/${format}/${getMinName(file)}`, dest: `${docsFolder}/js/${format}` })
      ]
    }
    o.output.push(outputMin)
  } else {
    o.output[0].exports = 'default'
  }
  o.plugins = [
    babel(format == 'esm' ? babelPropsESM : babelPropsCommon)
  ]
  return (o)
}

let myExports = []
const
  myFiles = ['amstramgramMediaPlayer.js', 'amstramgramAudioPlayer.js'],
  myFormats = ['esm', 'cjs', 'iife']
myFiles.forEach(file => myFormats.forEach(format => myExports.push(getExport(file, format))))

const
  polyfillName = 'amstramgramMediaPlayerPolyfill.js',
  bannerPolyfill = 'IE11 polyfills for\n  AmstramgramMediaPlayer.js',
  bannerPolyfillMin = bannerPolyfill.split('\n ').join(''),
  exportPolyfill = {
    input: `${srcFolder}/js/${polyfillName}`,
    output: [
      {
        format: 'esm',
        file: `${distFolder}/iife/${polyfillName}`,
        banner: getBanner(bannerPolyfill)
      },
      {
        format: 'esm',
        file: `${distFolder}/iife/${getMinName(polyfillName)}`,
        banner: getBanner(bannerPolyfillMin, true),
        plugins: [
          terser(),
          copyFile(
            { src: `${distFolder}/iife/${getMinName(polyfillName)}`, dest: `${docsFolder}/js/iife` },
          ),
        ]
      },
    ],
  }
myExports.push(exportPolyfill)


const replace = require('replace-in-file');
/**
 * @param {string} file : path to the js file
 * @description : 
 * Micro rollup plugin replaceLinks
 * Replace the assets links in js and html files
 * so they point to https://amp.onfaitdessites.fr/assets
 * Replace the amstramgramMediaPlayer css and js links
 * to the minified version
 */
 const replaceLinks = (file) => {
  return {
    writeBundle() {
      const 
        fileName = path.basename(file, '.js'),
        rep0 = replace.sync({
          files: [`${docsFolder}/js/${file}`, `${docsFolder}/${fileName}.html`],
          from: /\"assets/g,
          to: '"https://amp.onfaitdessites.fr/assets',
        }),
        changedFiles0 = rep0
          .filter(result => result.hasChanged)
          .map(result => result.file)
      if (changedFiles0.length > 0) {
        changedFiles0.forEach(changedFile => {
          console.log(`\x1b[33mAssets links have been updated in "${changedFile}"`)
        })
        const 
          rep1 = replace.sync({
            files: [`${docsFolder}/${fileName}.html`],
            from: [
              'href="./css/amstramgramMediaPlayer.css"', 
              'href="./css/amstramgramAudioPlayer.css"', 
              'from"./js/esm/amstramgramMediaPlayer.js"',
              'from"./js/esm/amstramgramAudioPlayer.js"',
              'nomodule="" src="./js/iife/amstramgramMediaPlayer.js"', 
              'nomodule="" src="./js/iife/amstramgramAudioPlayer.js"', 
            ],
            to: [
              'href="./css/amstramgramMediaPlayer.min.css"', 
              'href="./css/amstramgramAudioPlayer.min.css"', 
              'from"./js/esm/amstramgramMediaPlayer.min.js"',
              'from"./js/esm/amstramgramAudioPlayer.min.js"',
              'nomodule src="./js/iife/amstramgramMediaPlayer.min.js"', 
              'nomodule src="./js/iife/amstramgramAudioPlayer.min.js"', 
            ],
          }),
          changedFiles1 = rep1
            .filter(result => result.hasChanged)
            .map(result => result.file)
        if (changedFiles1.length > 0) {
          changedFiles1.forEach(changedFile => {
            console.log(`\x1b[33mStyles and scripts links have been updated in "${changedFile}"`)
          })
        }
      }
    }
  }
}

//Build each js file found in the root of the docsdev directory
fs.readdirSync(docs_srcFolder + '/js')
  .filter(file => {
    return file.endsWith('.js')
  })
  .forEach(file => {
    myExports.push({
      input: docs_srcFolder + '/js/' + file,
      output: {
        file: docsFolder + '/js/' + file,
      },
      plugins: [
        nodeResolve(),
        commonjs(),
        babel({
          babelHelpers: 'bundled',
          "presets": [
            [
              "@babel/preset-env",
              { "targets": "> 0.25%, not dead, IE 11" },
            ],
          ],
        }),
        terser(),
        replaceLinks(file)
      ]
    })
  });
export default myExports