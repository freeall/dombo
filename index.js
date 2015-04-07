var once = require('once')

module.exports = function(selector) {
  if (selector.nodeName) return selector

  var nodes = document.querySelectorAll(selector)

  if (nodes.length === 0) return null

  nodes.each = function(fn) {
    for (var i=0; i<nodes.length; i++) {
      fn(nodes[i], i)
    }
  }
  /*
    To handle event listeners, dombo attached its own even listener to the node.
    To do this properly dombo adds some data on the node.

    Node: {
      _domboListeners: {
        eventName: {
          original: function()... // the function given by the user
          internal: function()... // the function used internally by dombo
        }
      },
      ...
    }
  */
  var on = function(event, filter, fOriginal, one) {
    var fWrapped = one ? once(fOriginal) : fOriginal

    nodes.each(function(node) {
      var fInternal = function(mouseEvent) {
        if (!filter) return fWrapped.apply(this, mouseEvent)

        var filterList = this.querySelectorAll(filter)
        var filtered = false
        for (var i=0; i<filterList.length; i++) {
          if (filterList[i] === mouseEvent.srcElement) {
            filtered = true
            break
          }
        }
        if (!filtered) return
        fWrapped.apply(this, mouseEvent)
      }

      node._domboListeners = node._domboListeners || {}
      node._domboListeners[event] = node._domboListeners[event] || []
      node._domboListeners[event].push({
        original: fOriginal,
        internal: fInternal
      })
      node.addEventListener(event, fInternal, false)
    })
  }
  nodes.on = function(event, filter, fn) {
    if (!fn) return nodes.on(event, null, filter)
    on(event, filter, fn)
  }
  nodes.once = function(event, filter, fn) {
    if (!fn) return nodes.once(event, null, filter)
    on(event, filter, fn, 1)
  }
  nodes.off = function(event, fn) {
    nodes.each(function(node) {
      if (!node._domboListeners) return
      if (!node._domboListeners[event]) return

      node._domboListeners[event] = node._domboListeners[event].filter(function(listener) {
        if (listener.original !== fn) return true
        node.removeEventListener(event, listener.internal)
        return false
      })
    })
  }
  nodes.hasClass = function(name) {
    var res = false
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