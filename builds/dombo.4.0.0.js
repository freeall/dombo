(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$ = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
module.exports = {
  on: on,
  off: off,
  one: one,
  trigger: trigger
}

/*
  To handle event listeners, dombo attaches its own event listener to the node.
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
function _on (domboObj, event, selector, fOriginal, one) {
  var called = false

  return domboObj.forEach(function (node) {
    var fInternal = function (mouseEvent) {
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
      var isPossible = function (node) {
        for (var i=0; i<possibles.length; i++) {
          if (possibles[i] === node) return true
        }
        return false
      }
      var next = function (node) {
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

function on (event, filter, fn) {
  if (!fn) return this.on(event, null, filter)
  return _on(this, event, filter, fn)
}

function one (event, filter, fn) {
  if (!fn) return this.one(event, null, filter)
  return _on(this, event, filter, fn, 1)
}

function off (event, fn) {
  return this.forEach(function (node) {
    if (!node._domboListeners) return
    if (!node._domboListeners[event]) return

    node._domboListeners[event] = node._domboListeners[event].filter(function (listener) {
      if (listener.original !== fn) return true
      node.removeEventListener(event, listener.internal)
      return false
    })
  })
}

function trigger (name, data) {
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

},{}],3:[function(require,module,exports){
var ARRAY_PROPERTIES = [
  'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter',
  'find', 'findIndex', 'forEach', 'includes', 'indexOf', 'join',
  'keys', 'lastIndexOf', 'length', 'map', 'pop', 'push', 'reduce',
  'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort',
  'splice', 'toLocaleString', 'toSource', 'toString', 'unshift',
  'values', 'iterator'
]

var dombo = function  (selector, context) {
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
  nodes = Array.prototype.slice.call(nodes)

  var domboObj = new createDomboObject(nodes)

  return domboObj
}

/*
  The next three functions are the core functionality of Dombo.
*/
function createDomboObject (nodes) {
  var that = this
  var typesChecked = {}

  nodes.forEach(function (node) {
    if (typesChecked[node.tagName]) return
    typesChecked[node.tagName] = 1

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

  // Add methods from $.fn
  Object.keys(dombo.fn).forEach(function (name) {
    that[name] = dombo.fn[name]
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

var plugins = [
  require('./classes'),
  require('./events')
]

dombo.fn = {}
plugins.forEach(function (modul) {
  Object.keys(modul).forEach(function (name) {
    dombo.fn[name] = modul[name]
  })
})

module.exports = dombo

},{"./classes":1,"./events":2}]},{},[3])(3)
});