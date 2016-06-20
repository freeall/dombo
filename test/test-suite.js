module.exports = {
  equals: equals,
  setup: setup,
  teardown: teardown,
  benchmark: benchmark
}

function equals (expected, actual) {
  if (expected !== actual) throw new Error(expected + ' != ' + actual)
}

function setup (name, type) {
  type = type || 'div'
  var elem = document.createElement(type)
  elem.className = name
  document.body.appendChild(elem)
  return elem
}

function teardown (name) {
  $('.' + name).remove();
}

function benchmark (count, type) {
  type = type || 'div'

  for (var i = 0; i < count; i++) {
    setup('benchmark', type)
  }

  var before = Date.now()
  var elements = $('.benchmark')
  var after = Date.now()
  console.log('Selection with', count, type, 'elements takes', after - before, 'ms')

  elements.remove();
}
