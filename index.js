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

  if (selector instanceof DomboObject) {
    nodes = selector
  } else if (selector === window || selector === document || selector.nodeName) {
    nodes = [selector]
  } else {
    nodes = context.querySelectorAll(selector)
  }

  nodes = nodes || []
  nodes = Array.prototype.slice.call(nodes)

  var domboObj = new DomboObject(nodes)

  return domboObj
}

/*
  The next three functions are the core functionality of Dombo.
*/
function DomboObject (nodes) {
  var that = this

  this._nodes = nodes

  this._nodes.forEach(function (node) {
    if (that._typesChecked[node.tagName]) return
    that._typesChecked[node.tagName] = 1

    for (var name in node) {
      if (that[name] !== undefined) return

      var isFunction = typeof node[name] === 'function'

      if (isFunction) {
        Object.defineProperty(DomboObject.prototype, name, functionPattern(name))
      } else {
        Object.defineProperty(DomboObject.prototype, name, propertyPattern(name))
      }
    }
  })

  // Add methods from $.fn
  Object.keys(dombo.fn).forEach(function (name) {
    that[name] = dombo.fn[name]
  })

  // Make the object be array-like
  this._nodes.forEach(function (node, i) {
    that[i] = node
  })
  ARRAY_PROPERTIES.forEach(function (propertyName) {
    that[propertyName] = nodes[propertyName]
  })
}
DomboObject.prototype._typesChecked = {}

function propertyPattern (name) {
  return {
    get: function () {
      var res = []
      this._nodes.forEach(function (node) {
        res.push(node[name])
      })
      if (res.length === 1) return res[0]
      return res
    },
    set: function (val) {
      this._nodes.forEach(function (node) {
        node[name] = val
      })
    }
  }
}
function functionPattern (name) {
  return {
    get: function () {
      var that = this
      return function () {
        var res = []
        var args = arguments
        that._nodes.forEach(function (node) {
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
