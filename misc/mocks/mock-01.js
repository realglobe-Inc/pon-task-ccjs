'use strict'

;(function () {
  /**
   * This is a mock
   */

  function foo () {
    return 'bar'
  }

  if (1 < 2) {
    foo()
  }

  if (2 !== 2) {
    console.log('Never reached')
  }

  console.warn(foo())

  console.log('The mock!')
})()
