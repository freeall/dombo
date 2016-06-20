var test = require('./test-suite')

var testThreeElements = function() {
  test.setup('testThreeElements')
  test.setup('testThreeElements')
  test.setup('testThreeElements')

  var set = $('.testThreeElements')
  test.equals(3, set.length)

  test.teardown('testThreeElements')
}
var testSingleElement = function() {
  test.setup('testSingleElement')

  var elm = $('.testSingleElement')
  test.equals(1, elm.length)
  test.equals('testSingleElement', elm[0].className)

  test.teardown('testSingleElement')
}
var testDocument = function() {
  test.equals(document, $(document)[0])
}
var testWindow = function() {
  $(window) // will fail if it doesn't work
}
var testContext = function() {
  test.setup('testContext')
  var outer = test.setup('testContextOuter')
  var div = document.createElement('div')
  div.className = 'testContext'
  outer.appendChild(div)

  test.equals(2, $('.testContext').length)
  test.equals(2, $('.testContext', document.body).length)
  test.equals(1, $('.testContext', outer).length)

  test.teardown('testContext')
  test.teardown('testContextOuter')
}
var testElementAsSelector = function() {
  $($('body')[0])
}
var testUpdateValue = function () {
  test.setup('testUpdateValue', 'input')
  $('.testUpdateValue').value = 'foobar'
  test.equals('foobar', $('.testUpdateValue').value)
  test.teardown('testUpdateValue')
}
var testReadMultipleValues = function () {
  test.setup('testReadMultipleValues', 'input')
  test.setup('testReadMultipleValues', 'input')
  $('.testReadMultipleValues').value = 'foobar'

  // $('.testReadMultipleValues') === ['foobar', 'foobar']
  $('.testReadMultipleValues').forEach(function (nativeElement) {
    test.equals('foobar', nativeElement.value)
  })

  test.teardown('testReadMultipleValues')
}
var testRemoveMultipleElements = function () {
  test.setup('testRemoveMultipleElements')
  test.setup('testRemoveMultipleElements')
  test.setup('testRemoveMultipleElements')
  test.equals(3, $('.testRemoveMultipleElements').length)

  $('.testRemoveMultipleElements').remove()
  test.equals(0, $('.testRemoveMultipleElements').length)
}
var testCallUnknownMethodThrows = function () {
  var thrown = false
  try {
    $('.no_element').remove()
  }
  catch (e) {
    thrown = true
  }
  test.equals(true, thrown)
}
var testGetIndex = function () {
  test.setup('testGetIndex')
  test.setup('testGetIndex')

  $('.testGetIndex')[0].innerHTML = 'foobar'
  test.equals('foobar', $('.testGetIndex')[0].innerHTML)
  test.equals('', $('.testGetIndex')[1].innerHTML)

  test.teardown('testGetIndex')
}

testThreeElements()
testSingleElement()
testDocument()
testWindow()
testContext()
testElementAsSelector()
testUpdateValue()
testReadMultipleValues()
testRemoveMultipleElements()
testCallUnknownMethodThrows()
testGetIndex()

console.log('All tests ran perfectly')
// console.log('Now running some benchmarks')

// benchmark(1000, 'div')
// benchmark(10000, 'div')
// benchmark(100000, 'div')
// benchmark(1000, 'span')
// benchmark(10000, 'span')
// benchmark(100000, 'span')
// benchmark(1000, 'input')
// benchmark(10000, 'input')

// console.log('Test suite completed')
