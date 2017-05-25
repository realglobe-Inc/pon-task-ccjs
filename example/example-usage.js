'use strict'

const pon = require('pon')
const ccjs = require('pon-task-ccjs')

async function tryExample () {
  let run = pon({
    'production:cc': ccjs('public/bundle.js', 'public/bundle.cc.js')
  })

  run('production:cc')
}

tryExample()
