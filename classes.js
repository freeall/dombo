module.exports = {
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass
}

function hasClass (name) {
  var res = false
  this.forEach(function (node) {
    if (node.className.indexOf(name) > -1) res = true
  })
  return res
}

function addClass (name) {
  return this.forEach(function (node) {
    if (node.className.indexOf(name) > -1) return
    node.className += ' ' + name
  })
}

function removeClass (name) {
  return this.forEach(function (node) {
    if (node.className.indexOf(name) === -1) return
    node.className = node.className.split(name).join(' ')
  })
}

function toggleClass (name, state) {
  return this.forEach(function (node) {
    node = $(node)
    if (state === true) return node.addClass(name)
    if (state === false) return node.removeClass(name)
    if (node.hasClass(name)) return node.removeClass(name)
    return node.addClass(name)
  })
}
