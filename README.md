# dombo

A very limited subset of the jQuery methods.

Includes event handlers (on, off, one) and className manipulation (hasClass, addClass, removeClass)

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

### `$(selector[, context])

Returns the matched elements. If there is several matched elements it returns a `NodeList`. If there is only one matched element it returns only the single `Element`.

If a `context` is given, the selector is only checked in the descendant nodes of that context.

If the selector is already a `NodeList`, `Element`, `document`, or `window` it is simply just returned. This makes sure you can do `$($('.foo'))` without getting an error.

### `$(selector[, context]).each(fn)`

Iterates over all matched elements

### `$(selector[, context]).on(event, [selector,] fn)`

Adds event handler to all matched elements. If selector is given, then the event handler is only run if selector matches child elements.

### `$(selector[, context]).off(event, fn)`

Removes event handler from all matched elements

### `$(selector[, context]).one(event, [selector,] fn)`

Adds event handler to all matched elements, but guarantees it's not called after the first time the event fires.

### `$(selector[, context]).hasClass(name)`

Returns true if one node of the matched elements has the class

### `$(selector[, context]).addClass(name)`

Adds class to all matched elements

### `$(selector[, context]).removeClass(name)`

Removes class from all matched elements

## Properties

### length

Will always be set, even when there is only one matched element

## Browser support

Unlike jQuery, dombo only compatible with browser that supports `querySelectorAll`. This is most newer browsers, and even IE9 has full support for this. Check compatability list here https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll#Browser_compatibility

## License

MIT
