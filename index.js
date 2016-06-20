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
