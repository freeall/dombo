# dombo

A very limited subset of the jQuery methods.

Includes event handlers (on, off, once) and className manipulation (hasClass, addClass, removeClass)

```
npm install dombo
```

## Usage

``` js
var $ = require('dombo')

$('.item').each(function(elm) {
  console.log(elm)
})
```

## methods

### $(selector).each(fn)

Iterates over all matched elements

### $(selector).on(event, fn)

Adds event handler to all matched elements

### $(selector).off(event, fn)

Removes event handler from all matched elements

### $(selector).once(event, fn)

Adds event handler to all matched elements, but guarantees it's only called once

### $(selector).hasClass(name)

Returns true if one node of the matched elements has the class

### $(selector).addClass(name)

Adds class to all matched elements

### $(selector).removeClass(name)

Removes class from all matched elements

## License

MIT