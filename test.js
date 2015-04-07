var $ = require('./index')

var equals = function(expected, actual) {
  if (expected !== actual) throw new Error(expected + ' != ' + actual)
}

var setup = function(name) {
  var div = document.createElement('div')
  div.className = name
  document.body.appendChild(div)
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
var testOnFilter = function() {
  var clicks = 0
  var onclick = function() {
    clicks++
  }
  $('.outer').on('click', '.inner1', onclick)
  $('.inner1').click()
  $('.inner2').click()
  equals(1, clicks)
}
var testOnce = function() {
  setup('testOnce')

  var clicks = 0
  $('.testOnce').once('click', function() {
    clicks++
  })
  $('.testOnce').click()
  $('.testOnce').click()
  $('.testOnce').click()
  equals(1, clicks)

  teardown('testOnce')
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
var testOnceFilter = function() {
  var clicks = 0
  $('.outerOnce').once('click', '.innerOnce2', function() {
    clicks++
  })
  $('.innerOnce1').click()
  $('.innerOnce2').click()
  equals(1, clicks)
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
var testRemoveOnceListenerBeforeCall = function() {
  setup('testRemoveOnceListenerBeforeCall')

  var clicks = 0
  var onclick = function() {
    clicks++
  }
  $('.testRemoveOnceListenerBeforeCall').once('click', onclick)
  $('.testRemoveOnceListenerBeforeCall').off('click', onclick)
  $('.testRemoveOnceListenerBeforeCall').click()
  equals(0, clicks)

  teardown('testRemoveOnceListenerBeforeCall')
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

testThreeElements()
testSingleElement()
testSingleOn()
testMultipleOn()
testOnFilter()
testOnce()
testOff()
testOnceFilter()
testHasClass()
testAddClass()
testRemoveClass()
testRemoveListenerBeforeCall()
testRemoveOnceListenerBeforeCall()
testDocument()
testNodes()
testDocumentClick()