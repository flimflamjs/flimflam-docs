# Flim Flam Quick Start -- Counter Tutorial

To get a quick idea how the flimflam pattern works, we will build a simple counter component.

It will cover the basics of creating views, streams, and updates.

We will use [Ramda](https://ramdajs.com/0.19.1/docs/), [Flyd](https://github.com/paldepind/flyd), and [Snabbdom](https://github.com/paldepind/snabbdom) for this component.

Get your npm package initialized and dependencies installed:

```sh
npm init
npm install --save ramda flyd snabbdom
```

All the example code in this tutorial can go in a single index file. 

Add a test log in index.es6:

```js
console.log('hallo world')
```

Compile ES6 to ES5 with browserify / babelify. You can also use tools like [Budo](https://github.com/mattdesl/budo), [watchify](https://github.com/substack/watchify), and [gulp](http://gulpjs.com/). I like budo the most.

```
browserify -t babelify index.es6 > index.js
```

Include your compiled `index.js` file in `index.html` (not needed if using budo)

```html
<body>
  <div id='container'></div>
  <script src='./index.js'>
</body>
```

Open your browser and make sure the test command shows up in your console. If so, you have completed the basic build process. You will need to use browserify/babel every time you make an update to verify your results in the browser (or use Budo to speed things up).


## The view

It's often easiest to start by sketching out your view and seeing it render to the page before working on functionality.

The `h` function from snabbdom is used to create a virtual tree of DOM nodes that can be rendered to the page dynamically.

By convention, we call our main view function `view`, with the first argument being the component object (more on that soon).

** index.es6 **

```js
import h from 'snabbdom/h'

function view(component) {
  return h('div', [
    h('p', 'The count is x')
  , h('button', 'Increment!')
  , h('button', 'Decrement!')
  , h('button', 'Reset!')
  ])
}
```

This Virtual DOM is the same as writing the following HTML (except for the dynamic content):

```html
<div>
  <p>The count is x</p>
  <button>Increment!</button>
  <button>Decrement!</button>
  <button>Reset!</button>
</div>
```

To render our view to the page, we use the `flimflam-render` (run `npm install --save flimflam-render`)

```js
import render from 'flydflam-render'
let container = document.querySelector("#container")
render({}, view, container)
```

You can see we've left the first argument (the component object), empty for now. The component object will control UI state and functionality.

Run your build command and open up index.html in your browser to test that everything looks okay.

Now you have the basics of rendering markup to the page!

View functions are normal functions that take a component as the first parameter (and any other parameters you want) and return a Snabbdom Virtual DOM Tree using the `h` function. You can use many functions to split up your page, passing the component along the way, with any other arguments you need.


## Functionality

To get things working, we can create a ** component **. Flimflam components are plain javascript objects with a certain set of keys:

- `.streams` - flyd streams that are used for click events, form submits, ajax responses, etc.
- `.state` - data for the component to use in its view(s), which represents the current state of the UI
- `.updates` - an object of stream names and functions that update the component's state
- `.children` - nested child components

Components are initialized using an `init` function, which can be thought of as the initializer/constructor for the component.

The init function returns the component object. For a simple counter, we can do:

```js
function init() {
  return {
    streams: { add: flyd.stream() }
  , updates: { add: (n, state) => R.assoc('count', n + state.count), state) }
  , state:   { count: 0 }
  }
}
```

We return a `.streams` object, having a key `.add`, which we set to an empty flyd stream. This will be a stream of integers that get summed into a total.

`.updates` also has a key called `.add`, which means it uses the `add` stream from the `.streams` object. The `add` updater function takes a number (`n`) and the current state (`state`) and returns a new state. This `updates` object can be thought of as: "for every value on the `add` stream, apply this function to the value and to the current state. The return value of the function will be the new state."

All updater functions have this same format. Their first parameter is the current value from the stream. The second parameter is the current state. And they return a new, modified state. Every time one of your updater functions updates the state, the DOM will automatically update as well.

We use ramda functions to update the state immutably. In this case, we simply add `n` to the existing `count` key in the state. We always avoid mutation in the state object by using such ramda functions as `assoc`, `assocPath`, `merge`, `evolve`, `prepend`, `append`, and many others.

Your `init` function can take any parameters you want. Think of this as the API for the component. Often, for more complex components, you want to pass in default state data and other streams.

## View function, revised

The final step to get things working is to now make use of our `add` stream in the view, as well as printing the `count` value.

```js
// Our counter view (all the markup with event handler streams)
function view(component) {
  return h('body.counter', [
    h('p', `The total count is ${component.state.count}`)
  , h('button', {on: {click: [component.streams.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [component.streams.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [component.streams.add, -component.state.count]}}, 'Reset!')
  ])
}
```

We've updated our buttons to make use of the `add` stream from `component.streams`. We can use the `add` stream for the reset button as well by using the negative count, which will make the count zero when added. We use some ES6 interpolation (with backticks instead of quotes), and print `component.state.count`, which will always print the most recent value for `state.count`.
 
Now rebuild `index.es6` and test it!

## Component/View Template

Here is a handy blank template for making component/view files. 

```js
import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'

function init(yourParameters...) {
  let children = { }
  let state = { }
  let streams = { }
  let updates = { }
  return {children, state, streams, updates}
}

function view(component) {
  returh('h.your-markdown-here')
}
```

And here is a template for importing and rendering a parent component to the page.

```js
import component from './my-component'
import render from 'flimflam-render'

let container = document.querySelector('#my-container')
render(component.init(), component.view, container)
```

#### resources

- [counter code](/examples/counter/index.es6)
- [todo example](/examples/todo/index.es6)

