var ARRAY_PROPERTIES = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter',
  'find', 'findIndex', 'forEach', 'includes', 'indexOf', 'join',
  'keys', 'lastIndexOf', 'length', 'map', 'pop', 'push', 'reduce',
  'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort',
  'splice', 'toLocaleString', 'toSource', 'toString', 'unshift',
  'values', 'iterator'
]

module.exports = function(selector, context) {
  context = context || document

  var nodes

  if (selector._dombo) {
    nodes = selector
  } else if (selector === window || selector === document || selector.nodeName) {
    nodes = [selector]
  } else {
    nodes = context.querySelectorAll(selector)
  }

  nodes = nodes || []
  nodes = Array.prototype.slice.call(nodes);

  var domboObj = new createDomboObject(nodes)

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

    return nodes.forEach(function(node) {
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
  domboObj.on = function(event, filter, fn) {
    if (!fn) return domboObj.on(event, null, filter)
    return on(event, filter, fn)
  }
  domboObj.one = function(event, filter, fn) {
    if (!fn) return domboObj.one(event, null, filter)
    return on(event, filter, fn, 1)
  }
  domboObj.off = function(event, fn) {
    return domboObj.forEach(function(node) {
      if (!node._domboListeners) return
      if (!node._domboListeners[event]) return

      node._domboListeners[event] = node._domboListeners[event].filter(function(listener) {
        if (listener.original !== fn) return true
        node.removeEventListener(event, listener.internal)
        return false
      })
    })
  }
  domboObj.trigger = function(name, data) {
    return domboObj.forEach(function(node) {
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
        node.fireEvent("on" + evt.eventType, evt)
      }
    })
  }
  domboObj.hasClass = function(name) {
    var res = false
    domboObj.forEach(function(node) {
      if (node.className.indexOf(name) > -1) res = true
    })
    return res
  }
  domboObj.addClass = function(name) {
    return domboObj.forEach(function(node) {
      if (node.className.indexOf(name) > -1) return
      node.className += ' ' + name
    })
  }
  domboObj.removeClass = function(name) {
    return domboObj.forEach(function(node) {
      if (node.className.indexOf(name) === -1) return
      node.className = node.className.split(name).join(' ')
    })
  }
  domboObj.toggleClass = function(name, state) {
    return domboObj.forEach(function (node) {
      node = module.exports(node)
      if (state === true) return node.addClass(name)
      if (state === false) return node.removeClass(name)
      if (node.hasClass(name)) return node.removeClass(name)
      return node.addClass(name)
    })
  }

  return domboObj
}

/*
  The next three functions are the core functionality of Dombo.
*/
function createDomboObject (nodes) {
  var that = this
  var typesChecked = {}

  nodes.forEach(function (node, i) {
    if (typesChecked[node.tagName]) return;
    typesChecked[node.tagName] = 1;

    for (var name in node) {
      if (that[name]) return

      var isFunction = typeof node[name] === 'function'

      if (isFunction) {
        Object.defineProperty(that, name, functionPattern(name, nodes))
      } else {
        Object.defineProperty(that, name, propertyPattern(name, nodes))
      }
    }
  })

  // Make the object be array-like
  nodes.forEach(function (node, i) {
    that[i] = node
  })
  ARRAY_PROPERTIES.forEach(function (propertyName) {
    that[propertyName] = nodes[propertyName]
  })
  this._dombo = true
}

function propertyPattern (name, nodes) {
  return {
    get: function () {
      var res = []
      nodes.forEach(function (node) {
        res.push(node[name])
      })
      if (res.length === 1) return res[0]
      return res
    },
    set: function (val) {
      nodes.forEach(function (node) {
        node[name] = val
      })
    }
  }
}
function functionPattern (name, nodes) {
  return {
    get: function () {
      return function () {
        var res = []
        var args = arguments
        nodes.forEach(function (node) {
          res.push(node[name].apply(node, args))
        })

        if (res.length === 1) return res[0]
        return res
      }
    }
  }
}
