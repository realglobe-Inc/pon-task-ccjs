/**
 * Pon task to run Closure Compiler
 * @module pon-task-ccjs
 * @version 1.5.3
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
