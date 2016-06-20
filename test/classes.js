var test = require('./test-suite.js')

testHasClass()
testAddClass()
testRemoveClass()
testToogleState()
testToggleStateSwitch()

console.log('classes tests completed succesfully')

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
