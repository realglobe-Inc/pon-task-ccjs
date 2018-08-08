/**
 * Define task
 * @function define
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 * @param {Object} [options={}] - Optional settings
 * @param {string] [options.level='ADVANCED'] - Compile level
 * @param {string} [options.memory=''] - Java memory size
 * @returns {function} Defined task
 */
'use strict'

const path = require('path')
const aglob = require('aglob')
const {compiler: ClosureCompiler} = require('google-closure-compiler')

/** @lends define */
function define (src, dest, options = {}) {
  const {
    level = 'SIMPLE_OPTIMIZATIONS',
    memory = '',
    wrapper = ';(function(){%output%}).call(this);',
    from = 'ECMASCRIPT_NEXT',
    to = 'ECMASCRIPT5',
    skip = [],
    polyfill = false
  } = options

  async function task (ctx) {
    const {logger, cwd, writer} = ctx
    const compiler = new ClosureCompiler({
      js: src,
      compilation_level: level,
      output_wrapper: wrapper,
      language_out: to,
      language_in: from,
      hide_warnings_for: skip,
      rewrite_polyfills: polyfill
    }, [memory ? `-Xms${memory}` : null].filter(Boolean))
    logger.trace(`Compiling ${src}...`)
    const compiled = await new Promise((resolve, reject) =>
      compiler.run((code, stdOut, stdErr) => {
        code === 0 ? resolve(stdOut) : reject(new Error(`Failed to compile: \n${stdErr}`))
      })
    )
    logger.trace(`...compiling done!`)
    const {skipped} = await writer.write(dest, compiled, {
      mkdirp: true,
      skipIfIdentical: true
    })
    if (!skipped) {
      logger.debug('File generated:', path.relative(cwd, dest))
    }
  }

  return Object.assign(task, {})
}

Object.assign(define,
  {
    dir (srcDir, destDir, options = {}) {
      const {pattern = '*.js', ...otherOptions} = options
      return async function task (ctx) {
        const filenames = await aglob(pattern, {cwd: srcDir})
        for (const filename of filenames) {
          const src = path.resolve(srcDir, filename)
          const dest = path.resolve(destDir, filename)
          await define(src, dest, otherOptions)(ctx)
        }
      }
    }
  }
)

module.exports = define


