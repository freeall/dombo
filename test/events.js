var test = require('./test-suite.js')

testSingleOn()
testMultipleOn()
testOnFilter1()
testOnFilter2()
testOne()
testOff()
testOneFilter1()
testOneFilter2()
testRemoveListenerBeforeCall()
testRemoveOneListenerBeforeCall()
testDocumentClick()

console.log('events tests completed succesfully')

function testHasClass () {
  test.equals(true, $('.foo').hasClass('bar'))
  test.equals(true, $('.foo').hasClass('baz'))
  test.equals(false, $('.foo').hasClass('helloworld'))
}

function testAddClass () {
  test.equals(1, $('.bleh').length)
  $('.foo').addClass('bleh')
  test.equals(2, $('.bleh').length)
}

function testRemoveClass () {
  test.equals(2, $('.bar').length)
  $('.bar').removeClass('bar')
  test.equals(0, $('.bar').length)
}

function testToogleState () {
  test.setup('testToogleState')

  $('.testToogleState').addClass('foobar')
  test.equals(true, $('.testToogleState').hasClass('foobar'))
  $('.testToogleState').toggleClass('foobar')
  test.equals(false, $('.testToogleState').hasClass('foobar'))
  $('.testToogleState').toggleClass('foobar')
  test.equals(true, $('.testToogleState').hasClass('foobar'))
  $('.testToogleState').toggleClass('foobar', true)
  test.equals(true, $('.testToogleState').hasClass('foobar'))

  test.teardown('testToogleState')
}

function testToggleStateSwitch () {
  test.setup('testToggleState elem1 toggleThis')
  test.setup('testToggleState elem2')

  test.equals(true, $('.toggleThis').hasClass('elem1'))
  test.equals(1, $('.toggleThis').length)
  $('.testToggleState').toggleClass('toggleThis')
  test.equals(true, $('.toggleThis').hasClass('elem2'))
  test.equals(1, $('.toggleThis').length)

  test.teardown('testToggleState')
}

function testSingleOn () {
  test.setup('testSingleOn')

  var clicked = false
  $('.testSingleOn').on('click', function () {
    clicked = true
  })
  $('.testSingleOn').trigger('click')
  test.equals(true, clicked)

  test.teardown('testSingleOn')
}

function testMultipleOn () {
  test.setup('testMultipleOn')
  test.setup('testMultipleOn')

  var clicks = 0
  var prevNode
  $('.testMultipleOn').on('click', function () {
    clicks++
  })
  $('.testMultipleOn').forEach(function (node) {
    if (prevNode) test.equals(true, node !== prevNode)
    prevNode = node
    node.click()
  })
  test.equals(2, clicks)

  test.teardown('testMultipleOn')
}

function testOnFilter1 () {
  var state = 0
  var fInner = function () {
    if (this.className === 'testOnFilterInner tofi2') {
      test.equals(2, state++)
    }
    if (this.className === 'testOnFilterInner tofi1') {
      test.equals(3, state++)
    }
  }
  var ftofi1 = function () {
    test.equals(1, state++)
  }
  var ftofi2 = function () {
    test.equals(0, state++)
  }
  $('.testOnFilter').on('click', '.testOnFilterInner', fInner)
  $('.testOnFilterInner.tofi1').on('click', ftofi1)
  $('.testOnFilterInner.tofi2').on('click', ftofi2)

  $('.testOnFilterInner.tofi2').trigger('click')
  $('.testOnFilter').off('click', fInner)
  $('.testOnFilterInner.tofi1').off('click', ftofi1)
  $('.testOnFilterInner.tofi2').off('click', ftofi2)
}

function testOnFilter2 () {
  var state = 0
  var fInner = function () {
    test.equals(1, state++)
  }
  var f1 = function () {
    test.equals(0, state++)
  }
  var f2 = function () {
    throw new Error('Should not call this')
  }

  $('.testOnFilter').on('click', '.testOnFilterInner', fInner)
  $('.testOnFilterInner.tofi1').on('click', f1)
  $('.testOnFilterInner.tofi2').on('click', f2)
  $('.testOnFilterInner.tofi1').trigger('click')

  $('.testOnFilter').off('click', fInner)
  $('.testOnFilterInner.tofi1').off('click', f1)
  $('.testOnFilterInner.tofi2').off('click', f2)
}

function testOne () {
  test.setup('testOne')

  var clicks = 0
  $('.testOne').one('click', function () {
    clicks++
  })
  $('.testOne').trigger('click')
  $('.testOne').trigger('click')
  $('.testOne').trigger('click')
  test.equals(1, clicks)

  test.teardown('testOne')
}

function testOff () {
  test.setup('testOff')

  var clicks = 0
  var onclick = function () {
    clicks++
  }
  $('.testOff').on('click', onclick)
  $('.testOff').trigger('click')
  $('.testOff').off('click', onclick)
  $('.testOff').trigger('click')
  test.equals(1, clicks)

  test.teardown('testOff')
}

function testOneFilter1 () {
  var clicks = 0
  var f = function () {
    clicks++
  }
  $('.outerOne').one('click', '.innerOne2', f)
  $('.innerOne1').trigger('click')
  $('.innerOne2').trigger('click')
  test.equals(1, clicks)

  $('.outerOne').off('click', f)
}

function testOneFilter2 () {
  var clicks = 0
  var f = function () {
    clicks++
  }
  $('.testOnFilter').one('click', '.testOnFilterInner', f)
  $('.testOnFilterInner.tofi2').trigger('click')
  test.equals(2, clicks)

  $('.testOnFilter').off('click', f)
}

function testRemoveListenerBeforeCall () {
  test.setup('testRemoveListenerBeforeCall')

  var clicks = 0
  var onclick = function () {
    clicks++
  }
  $('.testRemoveListenerBeforeCall').on('click', onclick)
  $('.testRemoveListenerBeforeCall').off('click', onclick)
  $('.testRemoveListenerBeforeCall').trigger('click')
  test.equals(0, clicks)

  test.teardown('testRemoveListenerBeforeCall')
}

function testRemoveOneListenerBeforeCall () {
  test.setup('testRemoveOneListenerBeforeCall')

  var clicks = 0
  var onclick = function () {
    clicks++
  }
  $('.testRemoveOneListenerBeforeCall').one('click', onclick)
  $('.testRemoveOneListenerBeforeCall').off('click', onclick)
  $('.testRemoveOneListenerBeforeCall').trigger('click')
  test.equals(0, clicks)

  test.teardown('testRemoveOneListenerBeforeCall')
}

function testDocumentClick () {
  var clicks = 0
  $(document).on('click', function () {
    clicks++
  })
  $('body').trigger('click')
  test.equals(1, clicks)
}
