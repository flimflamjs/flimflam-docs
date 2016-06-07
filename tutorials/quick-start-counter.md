# Flim Flam Quick Start -- Counter Tutorial

To get a quick idea how the flimflam pattern works, we will build a simple counter component.

It will cover the basics of creating views, streams, and updates.

We will use [Ramda](https://ramdajs.com/0.19.1/docs/), [Flyd](https://github.com/paldepind/flyd), and [Snabbdom](https://github.com/paldepind/snabbdom) for this state.

Get a basic familiarity with flyd streams and functional reactive programming by reading the flyd documentation above.

Get your npm package initialized and dependencies installed:

```sh
npm init
npm install --save --save-exact ramda flyd snabbdom
```

All the example code in this tutorial can go in a single index file. 

Add a test log in index.es6:

```js
console.log('hallo world')
```

Compile ES6 to ES5 with browserify / babelify. I also highly recommend [Budo](https://github.com/mattdesl/budo). Other useful build tools are [watchify](https://github.com/substack/watchify) and [gulp](http://gulpjs.com/).

```
browserify -t babelify index.es6 > index.js
```

Include your compiled `index.js` file in `index.html` (not needed if using budo):

```html
<body>
  <div id='container'></div>
  <script src='./index.js'>
</body>
```

Open your browser and make sure the test command shows up in your console. If so, you have completed the basic build process. You will need to use browserify/babel every time you make an update to verify your results in the browser (or use Budo with LiveReload).

## The view

It's often easiest to start by sketching out your view and seeing it render to the page before working on functionality.

The `h` function from snabbdom is used to create a virtual tree of DOM nodes that can be rendered to the page dynamically.

By convention, we call our main view function `view`, with the first argument being the state object (more on that soon).

** index.es6 **

```js
import h from 'snabbdom/h'

function view(state) {
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

To render our VTree to the page, we make use of snabbdom's patch function, which is modular. For this component, we only need the eventlisteners module:

```js
import snabbdom from 'snabbdom/patch'
const patch = snabbdom.init([ require('snabbdom/modules/eventlisteners') ])
```


To actually perform the rendering, we can use the `flimflam-render` (run `npm install --save --save-exact flimflam-render`)

```js
import render from 'flydflam-render'
render({
  view: view
, container: document.querySelector("#container")
, patch: patch
, state: {}
})
```

You can see we've left the state object blank for now. We will add the functionality into there next.

This render function will handle some of the behind-the-scenes functionality
that ensures that your view function will get re-rendered to the page every
time you update some data in your state.

Run your build command and open up index.html in your browser to test that everything looks okay.

Now you have the basics of rendering markup to the page!

View functions are normal functions that take a state object as the first parameter (and any other parameters you want) and return a Snabbdom Virtual DOM Tree using the `h` function. You can use many functions to split up your page, passing the state data along the way, with any other arguments you need.


## Functionality

To get things actually working, we can create a **state object**. Flimflam states are simple javascript objects that hold plain JS values and flyd streams.

Use an initialization function (call it `init`) to construct the state object. 

```js
function init() {
  const add = flyd.stream()
  const sum = flyd.scan(R.add, 0, add)
  return {add, sum}
}
```

We are initializing a state object that has two flyd streams inside it: `add` and `sum`. The add stream will hold values that the user wants to add to the counter (these values will be emitted from an event listener on a button). The sum stream adds up all the `add` stream values to create a stream of sum values.

The `sum` stream uses the flyd [scan](https://github.com/paldepind/flyd) function. It is similar to the reduce function from functional programming, but returns a stream of accumulated values instead of a single value. It starts with an initial seed value, `0`, and adds each successive value from the `add` stream to get a rolling sum.

You can see how ramda (above imported as `R`) is very handy for functional programming -- we can pass the ramda addition function as the first argument to calculate the sum. This scan function could be written without ramda like this: `flyd.scan((acc, n) => acc + n, 0, add)`.

## View function, revised

The final step to get things working is to now make use of our newly created `add` and `sum` streams in the view:

```js
// Our counter view (all the markup with event handler streams)
function view(ctx) {
  return h('div', [
    h('p', `The total count is ${state.sum()}`)
  , h('button', {on: {click: [state.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [state.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [state.add, -state.sum()]}}, 'Reset!')
  ])
}
```

We need to call the streams to get their current value like: `state.sum()`.

We can bind streams in our state to eventlisteners by simply passing the streams to the snabbdom click handler.

In the snippet `{on: {click: [state.add, 1]}}`, we are saying that every time someone clicks on this button we want to emit the value `1` on the `add` stream. In snabbdom, when you pass a pair of `[function, value]`, snabbdom will call that function with that value every time the event occurs.

Now rebuild `index.es6` and test it!

