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
var on = function(domboObj, event, selector, fOriginal, one) {
  var called = false

  return domboObj.forEach(function(node) {
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
        if (node === handlerNode) return
        if (isPossible(node)) {
          called = true
          fOriginal.apply(node, [mouseEvent])
        }
        if (!node.parentNode) return
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

$.fn.on = function (event, filter, fn) {
  if (!fn) return this.on(event, null, filter)
  return on(this, event, filter, fn)
}

$.fn.one = function (event, filter, fn) {
  if (!fn) return this.one(event, null, filter)
  return on(this, event, filter, fn, 1)
}

$.fn.off = function (event, fn) {
  return this.forEach(function(node) {
    if (!node._domboListeners) return
    if (!node._domboListeners[event]) return

    node._domboListeners[event] = node._domboListeners[event].filter(function (listener) {
      if (listener.original !== fn) return true
      node.removeEventListener(event, listener.internal)
      return false
    })
  })
}

$.fn.trigger = function (name, data) {
  return this.forEach(function (node) {
    // From http://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
    if (document.createEvent) {
      var evt = document.createEvent('HTMLEvents')
      evt.initEvent(name, true, true)
      evt.eventName = name
      node.dispatchEvent(evt)
    } else {
      var evt = document.createEventObject()
      evt.eventType = name
      evt.eventName = name
      node.fireEvent('on' + evt.eventType, evt)
    }
  })
}

$.fn.hasClass = function(name) {
  var res = false
  this.forEach(function(node) {
    if (node.className.indexOf(name) > -1) res = true
  })
  return res
}

$.fn.addClass = function(name) {
  return this.forEach(function(node) {
    if (node.className.indexOf(name) > -1) return
    node.className += ' ' + name
  })
}

$.fn.removeClass = function(name) {
  return this.forEach(function(node) {
    if (node.className.indexOf(name) === -1) return
    node.className = node.className.split(name).join(' ')
  })
}

$.fn.toggleClass = function(name, state) {
  return this.forEach(function (node) {
    node = $(node)
    if (state === true) return node.addClass(name)
    if (state === false) return node.removeClass(name)
    if (node.hasClass(name)) return node.removeClass(name)
    return node.addClass(name)
  })
}
