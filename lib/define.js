/**
 * Define task
 * @function define
 * @param {string} src - Source file path
 * @param {string} dest - Destination file path
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const path = require('path')
const co = require('co')
const { compiler: ClosureCompiler } = require('google-closure-compiler')

/** @lends define */
function define (src, dest, options = {}) {
  let {
    level = 'ADVANCED'
  } = options

  function task (ctx) {
    const { logger, cwd, writer } = ctx
    return co(function * () {
      let compiler = new ClosureCompiler({
        js: src,
        compilation_level: level
      })
      let compiled = yield new Promise((resolve, reject) =>
        compiler.run((code, stdOut, stdErr) => {
          code === 0 ? resolve(stdOut) : reject(new Error(`Failed to compile: \n${stdErr}`))
        })
      )
      let { skipped } = yield writer.write(dest, compiled, {
        mkdirp: true,
        skipIfIdentical: true
      })
      if (!skipped) {
        logger.debug('File generated:', path.relative(cwd, dest))
      }
    })
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define


