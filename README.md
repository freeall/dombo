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
$('.item').on('click', '.delete', function() {
	console.log('Removes item')
	this.remove()
})
```

## Methods

### $(selector).each(fn)

Iterates over all matched elements

### $(selector).on(event, [filter,] fn)

Adds event handler to all matched elements. If filter is given, then the event handler is only run if filter matches child elements.

### $(selector).off(event, fn)

Removes event handler from all matched elements

### $(selector).once(event, [filter,] fn)

Adds event handler to all matched elements, but guarantees it's only called once

### $(selector).hasClass(name)

Returns true if one node of the matched elements has the class

### $(selector).addClass(name)

Adds class to all matched elements

### $(selector).removeClass(name)

Removes class from all matched elements

## Properties

### length

Will always be set, even when there is only one matched element

## License

MIT