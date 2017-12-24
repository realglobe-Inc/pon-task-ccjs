/**
 * Define task
 * @function define
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 * @param {Object} [options={}] - Optional settings
 * @param {string] [options.level='ADVANCED'] - Compile level
 * @param {string} [options.memory='2048m'] - Java memory size
 * @returns {function} Defined task
 */
'use strict'

const path = require('path')
const {compiler: ClosureCompiler} = require('google-closure-compiler')

/** @lends define */
function define (src, dest, options = {}) {
  const {
    level = 'SIMPLE_OPTIMIZATIONS',
    memory = '1024m',
    wrapper = ';(function(){%output%}).call(this);',
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
      hide_warnings_for: skip,
      rewrite_polyfills: polyfill
    }, [`-Xms${memory}`])
    const compiled = await new Promise((resolve, reject) =>
      compiler.run((code, stdOut, stdErr) => {
        code === 0 ? resolve(stdOut) : reject(new Error(`Failed to compile: \n${stdErr}`))
      })
    )
    const {skipped} = await writer.write(dest, compiled, {
      mkdirp: true,
      skipIfIdentical: true
    })
    if (!skipped) {
      logger.debug('File generated:', path.relative(cwd, dest))
    }
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define


