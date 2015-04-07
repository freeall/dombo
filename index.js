var once = require('once')

module.exports = function(el) {
  var nodes = document.querySelectorAll(el)

  if (nodes.length === 0) return undefined

  nodes.each = function(fn) {
    for (var i=0; i<nodes.length; i++) {
      fn(nodes[i], i)
    }
  }
  nodes.on = function(event, fn) {
    nodes.each(function(node) {
      node.addEventListener(event, fn, false)
    })
  }
  nodes.once = function(event, fn) {
    nodes.each(function(node) {
      node.addEventListener(event, once(fn), false)
    })
  }
  nodes.off = function(event, fn) {
    nodes.each(function(node) {
      node.removeEventListener(event, fn)
    })
  }
  nodes.hasClass = function(name) {
    var res = false;
    nodes.each(function(node) {
      if (node.className.indexOf(name) > -1) res = true
    })
    return res
  }
  nodes.addClass = function(name) {
    nodes.each(function(node) {
      if (node.className.indexOf(name) > -1) return
      node.className += ' ' + name
    })
  }
  nodes.removeClass = function(name) {
    nodes.each(function(node) {
      if (node.className.indexOf(name) === -1) return
      node.className = node.className.split(name).join(' ')
    })
  }

  if (nodes.length > 1) return nodes

  var node = nodes[0]
  node.each = nodes.each
  node.on = nodes.on
  node.once = nodes.once
  node.off = nodes.off
  node.hasClass = nodes.hasClass
  node.addClass = nodes.addClass
  node.removeClass = nodes.removeClass
  node.length = 1

  return node
}