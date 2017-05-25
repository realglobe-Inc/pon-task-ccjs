/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const { ok } = require('assert')
const co = require('co')

describe('define', function () {
  this.timeout(33000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let ctx = ponContext()
    let task = define(
      `${__dirname}/../misc/mocks/mock-01.js`,
      `${__dirname}/../tmp/foo/testing-01.cc.js`,
      {}
    )
    ok(task)

    yield Promise.resolve(task(ctx))
  }))
})

/* global describe, before, after, it */
