module.exports = function(selector) {
  var nodes = selector.nodeName || selector === window ? [selector] : document.querySelectorAll(selector)

  if (nodes.length === 0) return null

  nodes.each = function(fn) {
    for (var i=0; i<nodes.length; i++) {
      fn(nodes[i], i)
    }
    return this
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
  var on = function(event, selector, fOriginal, one) {
    var called = false

    return nodes.each(function(node) {
      var fInternal = function(mouseEvent) {
        if (one && called) return

        if (!selector) {
          called = true
          return fOriginal.apply(this, [mouseEvent])
        }

        /*
          Traverses from mouseEvent.srcElement and up to this(where the event handler is attached).
          On each node it checks to see if the node is part of the matched elements.
        */
        var handlerNode = this
        var possibles = this.querySelectorAll(selector)
        var isPossible = function(node) {
          for (var i=0; i<possibles.length; i++) {
            if (possibles[i] === node) return true
          }
          return false
        }
        var next = function(node) {
          if (node === handlerNode) return;
          if (isPossible(node)) {
            called = true
            fOriginal.apply(node, [mouseEvent])
          }
          next(node.parentNode)
        }
        next(mouseEvent.srcElement)
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
    return on(event, filter, fn)
  }
  nodes.one = function(event, filter, fn) {
    if (!fn) return nodes.one(event, null, filter)
    return on(event, filter, fn, 1)
  }
  nodes.off = function(event, fn) {
    return nodes.each(function(node) {
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
    return nodes.each(function(node) {
      if (node.className.indexOf(name) > -1) return
      node.className += ' ' + name
    })
  }
  nodes.removeClass = function(name) {
    return nodes.each(function(node) {
      if (node.className.indexOf(name) === -1) return
      node.className = node.className.split(name).join(' ')
    })
  }
  nodes.toggleClass = function(name) {
    if (nodes.hasClass(name)) return nodes.removeClass(name)
    return nodes.addClass(name)
  }

  if (nodes.length > 1) return nodes

  var node = nodes[0]
  node.each = nodes.each
  node.on = nodes.on
  node.one = nodes.one
  node.off = nodes.off
  node.hasClass = nodes.hasClass
  node.addClass = nodes.addClass
  node.removeClass = nodes.removeClass
  node.length = 1

  return node
}
