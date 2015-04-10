var $ = require('./index')

var equals = function(expected, actual) {
  if (expected !== actual) throw new Error(expected + ' != ' + actual)
}

var setup = function(name) {
  var div = document.createElement('div')
  div.className = name
  document.body.appendChild(div)
  return div
}
var teardown = function(name) {
  $('.'+name).each(function(node) {
    node.remove()
  })
}

var testThreeElements = function() {
  setup('testThreeElements')
  setup('testThreeElements')
  setup('testThreeElements')

  var set = $('.testThreeElements')
  equals(3, set.length)

  teardown('testThreeElements')
}
var testSingleElement = function() {
  setup('testSingleElement')

  var elm = $('.testSingleElement')
  equals(1, elm.length)
  equals('testSingleElement', elm.className)

  teardown('testSingleElement')
}
var testSingleOn = function() {
  setup('testSingleOn')

  var clicked = false
  $('.testSingleOn').on('click', function() {
    clicked = true
  })
  $('.testSingleOn').click()
  equals(true, clicked)

  teardown('testSingleOn')
}
var testMultipleOn = function() {
  setup('testMultipleOn')
  setup('testMultipleOn')

  var clicks = 0
  var prevNode
  $('.testMultipleOn').on('click', function() {
    clicks++
  })
  $('.testMultipleOn').each(function(node) {
    if (prevNode) equals(true, node !== prevNode)
    prevNode = node
    node.click()
  })
  equals(2, clicks)

  teardown('testMultipleOn')
}
var testOnFilter1 = function() {
  var state = 0
  var fInner = function() {
    if (this.className === 'testOnFilterInner tofi2') {
      equals(2, state++)
    }
    if (this.className === 'testOnFilterInner tofi1') {
      equals(3, state++)
    }
  }
  var ftofi1 = function() {
    equals(1, state++)
  }
  var ftofi2 = function() {
    equals(0, state++)
  }
  $('.testOnFilter').on('click', '.testOnFilterInner', fInner)
  $('.testOnFilterInner.tofi1').on('click', ftofi1)
  $('.testOnFilterInner.tofi2').on('click', ftofi2)

  $('.testOnFilterInner.tofi2').click()
  $('.testOnFilter').off('click', fInner)
  $('.testOnFilterInner.tofi1').off('click', ftofi1)
  $('.testOnFilterInner.tofi2').off('click', ftofi2)
}
var testOnFilter2 = function() {
  var state = 0
  var fInner = function() {
    equals(1, state++)
  }
  var f1 = function() {
    equals(0, state++)
  }
  var f2 = function() {
    throw new Error('Should not call this')
  }

  $('.testOnFilter').on('click', '.testOnFilterInner', fInner)
  $('.testOnFilterInner.tofi1').on('click', f1)
  $('.testOnFilterInner.tofi2').on('click', f2)
  $('.testOnFilterInner.tofi1').click()

  $('.testOnFilter').off('click', fInner)
  $('.testOnFilterInner.tofi1').off('click', f1)
  $('.testOnFilterInner.tofi2').off('click', f2)
}
var testOne = function() {
  setup('testOne')

  var clicks = 0
  $('.testOne').one('click', function() {
    clicks++
  })
  $('.testOne').click()
  $('.testOne').click()
  $('.testOne').click()
  equals(1, clicks)

  teardown('testOne')
}
var testOff = function() {
  setup('testOff')

  var clicks = 0
  var onclick = function() {
    clicks++
  }
  $('.testOff').on('click', onclick)
  $('.testOff').click()
  $('.testOff').off('click', onclick)
  $('.testOff').click()
  equals(1, clicks)

  teardown('testOff')
}
var testOneFilter1 = function() {
  var clicks = 0
  var f = function() {
    clicks++
  }
  $('.outerOne').one('click', '.innerOne2', f)
  $('.innerOne1').click()
  $('.innerOne2').click()
  equals(1, clicks)

  $('.outerOne').off('click', f)
}
var testOneFilter2 = function() {
  var clicks = 0
  var f = function() {
    clicks++
  }
  $('.testOnFilter').one('click', '.testOnFilterInner', f)
  $('.testOnFilterInner.tofi2').click()
  equals(2, clicks)

  $('.testOnFilter').off('click', f)
}
var testHasClass = function() {
  equals(true, $('.foo').hasClass('bar'))
  equals(true, $('.foo').hasClass('baz'))
  equals(false, $('.foo').hasClass('helloworld'))
}
var testAddClass = function() {
  equals(1, $('.bleh').length)
  $('.foo').addClass('bleh')
  equals(2, $('.bleh').length)
}
var testRemoveClass = function() {
  equals(2, $('.bar').length)
  $('.bar').removeClass('bar')
  equals(null, $('.bar'))
}
var testRemoveListenerBeforeCall = function() {
  setup('testRemoveListenerBeforeCall')

  var clicks = 0
  var onclick = function() {
    clicks++
  }
  $('.testRemoveListenerBeforeCall').on('click', onclick)
  $('.testRemoveListenerBeforeCall').off('click', onclick)
  $('.testRemoveListenerBeforeCall').click()
  equals(0, clicks)

  teardown('testRemoveListenerBeforeCall')
}
var testRemoveOneListenerBeforeCall = function() {
  setup('testRemoveOneListenerBeforeCall')

  var clicks = 0
  var onclick = function() {
    clicks++
  }
  $('.testRemoveOneListenerBeforeCall').one('click', onclick)
  $('.testRemoveOneListenerBeforeCall').off('click', onclick)
  $('.testRemoveOneListenerBeforeCall').click()
  equals(0, clicks)

  teardown('testRemoveOneListenerBeforeCall')
}
var testDocument = function() {
  equals(document, $(document))
}
var testNodes = function() {
  setup('testNodes')

  var set = $('.testNodes')
  equals(set, $(set))

  teardown('testNodes')
}
var testDocumentClick = function() {
  var clicks = 0
  $(document).on('click', function() {
    clicks++
  })
  $('body').click()
  equals(1, clicks)
}
var testWindow = function() {
  $(window) // will fail if it doesn't work
}
var testContext = function() {
  setup('testContext')
  var outer = setup('testContextOuter')
  var div = document.createElement('div')
  div.className = 'testContext'
  outer.appendChild(div)

  equals(2, $('.testContext').length)
  equals(2, $('.testContext', document.body).length)
  equals(1, $('.testContext', outer).length)

  teardown('testContext')
  teardown('testContextOuter')
}

testThreeElements()
testSingleElement()
testSingleOn()
testMultipleOn()
testOnFilter1()
testOnFilter2()
testOne()
testOff()
testOneFilter1()
testOneFilter2()
testHasClass()
testAddClass()
testRemoveClass()
testRemoveListenerBeforeCall()
testRemoveOneListenerBeforeCall()
testDocument()
testNodes()
testDocumentClick()
testWindow()
testContext()