# dombo

Dombo is a tiny wrapper on the browser, to help work on nodes, similar to jquery. But much closer to the metal of the browser, and a lot less overhead.

It includes a selector, `$('.foo')` works the same way as [jQuery's selector](https://api.jquery.com/jQuery/). It returns an array-like object, but with all the properties of the nodes in the selected set.

It also includes a little sugar from jquery: `on`, `off`, `one`, `trigger`, `addClass`, `removeClass`, `hasClass`, `toggleClass`.

## Example

With some html like

``` html
<input class="someInput">
<input class="someInput">
<input class="someInput">
<div class="removeMe">I'm not here</div>
```

this code

``` js
$('.someInput').value = 'foobar'
console.log($('.someInput').value)
$('.removeMe').remove()
```

will set the value of all the input fields to `foobar`, print `foobar`, and also remove the `div`.

## Plugins

It is possible to add methods, to the returned nodes, with the `$.fn` object.

E.g, `$.fn.foobar = function (this) { ... }`. `this` in this case is the array-like dombo object.

### Larger plugin example

``` js
/*
  $('.foo').isHtml('bar')
  returns true if .innerHTML of all nodes is 'bar'
*/

$.fn.isHtml = function (str) {
  return this.reduce(function (res, node) {
    return res && node.innerHTML === str
  }, true)
}
```

## Selectors

### `$(selector[, context])`

Returns an array with the matched elements, with the methods in this doc added to it. Returns an empty array if there are no matched elements.

If a `context` is given, the selector is only checked in the descendant nodes of that context.

If the selector is already a previous returned value from dombo, then it is simply returned. This makes sure that `$('.foo') === $($('.foo'))`.

## Added methods

These methods are some extra nice functions that jquery includes today.

If the selector is `document` or `window` it is also just returned, so you can do `$(document)` and `$(window)`.

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

### `$(selector[, context]).toggleClass(name[, state])`

Adds/removes class on the matched elements depending on whether or not it's already present.

`State` is a boolean, and if it's set, adds/removes classes accordingly.

## Tests

To run the test cases run `npm test` and open the browser and go to `http://localhost:9966/test/dombo.html` and `http://localhost:9966/jquery.html`.

## Browser support

Dombo is not aiming for legacy browser support.

This means that it's only compatible with browsers that supports `querySelectorAll` and `Object.defineProperty`. This is most newer browsers. Check compatability list here https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll#Browser_compatibility and http://caniuse.com/#search=defineproperty

## License

MIT
