var test = require('./test-suite')

testThreeElements()
testSingleElement()
testDocument()
testWindow()
testContext()
testElementAsSelector()
testUpdateValue()
testReadMultipleValues()
testRemoveMultipleElements()
testGetIndex()

console.log('base functionality tests completed succesfully')

function testThreeElements () {
  test.setup('testThreeElements')
  test.setup('testThreeElements')
  test.setup('testThreeElements')

  var set = $('.testThreeElements')
  test.equals(3, set.length)

  test.teardown('testThreeElements')
}

function testSingleElement () {
  test.setup('testSingleElement')

  var elm = $('.testSingleElement')
  test.equals(1, elm.length)
  test.equals('testSingleElement', elm[0].className)

  test.teardown('testSingleElement')
}

function testDocument () {
  test.equals(document, $(document)[0])
}

function testWindow () {
  $(window) // will fail if it doesn't work
}

function testContext () {
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

function testElementAsSelector () {
  $($('body')[0])
}

function testUpdateValue  () {
  test.setup('testUpdateValue', 'input')
  $('.testUpdateValue').value = 'foobar'
  test.equals('foobar', $('.testUpdateValue').value)
  test.teardown('testUpdateValue')
}

function testReadMultipleValues  () {
  test.setup('testReadMultipleValues', 'input')
  test.setup('testReadMultipleValues', 'input')
  $('.testReadMultipleValues').value = 'foobar'

  // $('.testReadMultipleValues') === ['foobar', 'foobar']
  $('.testReadMultipleValues').forEach(function (nativeElement) {
    test.equals('foobar', nativeElement.value)
  })

  test.teardown('testReadMultipleValues')
}

function testRemoveMultipleElements  () {
  test.setup('testRemoveMultipleElements')
  test.setup('testRemoveMultipleElements')
  test.setup('testRemoveMultipleElements')
  test.equals(3, $('.testRemoveMultipleElements').length)

  $('.testRemoveMultipleElements').remove()
  test.equals(0, $('.testRemoveMultipleElements').length)
}

function testGetIndex  () {
  test.setup('testGetIndex')
  test.setup('testGetIndex')

  $('.testGetIndex')[0].innerHTML = 'foobar'
  test.equals('foobar', $('.testGetIndex')[0].innerHTML)
  test.equals('', $('.testGetIndex')[1].innerHTML)

  test.teardown('testGetIndex')
}
