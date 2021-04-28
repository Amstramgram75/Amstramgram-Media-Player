const
  fs = require('fs-extra'),
  path = require('path')

//Remove docs_dev content except the assets folder
fs
  .readdirSync('docs_dev')
  .filter(file => file != 'assets').forEach(file => {
    fs.removeSync(path.resolve('docs_dev', file))
  })

//Copy to docs_dev minified version of highlight9.18.5 and its polyfills for IE11
fs.copySync(`docs_src${path.sep}js${path.sep}polyfill`, `docs_dev${path.sep}js${path.sep}polyfill`, {
  filter:
    src => {
      //For the first two passages, src == `docs_src/js/polyfill`
      return (src.endsWith('.min.js') || src == `docs_src${path.sep}js${path.sep}polyfill`)
    }
  }
)

let initCount = 0
const 
  jsFiles = fs.readdirSync(`docs_src${path.sep}js`),
  lastJsFile = jsFiles[jsFiles.length - 1],
  exec = require('child_process').exec,
  //Watch changes on docs_src html files to launch the posthtml compilation
  //Have a look at .posthtmlrc root file for posthtml settings
  posthtml = exec('"./node_modules/.bin/onchange" -i docs_src/**/*.html -- "./node_modules/.bin/posthtml" -c .posthtmlrc_dev'),
  //Watch changes on src and docs_src sass files and process them to docs_dev
  sass = exec('"./node_modules/.bin/sass" src/scss:docs_dev/css docs_src/scss:docs_dev/css --watch')
  //Run rollup with its rollup.config.js and its watcher
  rollup = exec('"./node_modules/.bin/rollup" -c -w')


//listen on posthtml stdout
//sequence '\x1b[32m' : green
//sequence '\x1b[96m' : bright cyan
//sequence '\\x1b[0m' : reset
posthtml.stdout.on('data', function (chunk) {
  console.log('\x1b[32mposthtml: \x1b[96m' + chunk.toString('utf8') + '\x1b[0m')
})

// listen on sass stdout
sass.stdout.on('data', function (chunk) {
  console.log('\x1b[32msass: \x1b[96m' + chunk.toString('utf8') + '\x1b[0m')
})

// listen on rollup stderr
rollup.stderr.on('data', function (chunk) {
  console.log('\x1b[32mrollup: ' + chunk.toString('utf8') + '\x1b[0m')
  if (initCount < 2 && chunk.toString('utf8').includes(`docs_dev${path.sep}js${path.sep}${lastJsFile}`)) {
    if (initCount == 0) {
      initCount = 1
    } else {
      initCount = 2
      console.log('\x1b[96mAll development files have been created !!!')
      console.log('\nNOW WATCHING.........\x1b[0m')
    }
  }
})

