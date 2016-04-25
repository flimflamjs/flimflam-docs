
# flimflam specification

Flimflam is mostly a specification about "UI components", rather than other types of modules:

- A **UI component** is a javascript module that is meant to be rendered into the browser/app and represents a part of a User Interface.
- Non-UI components are considered utility packages, and handle things like date formatting, ajax, currency calculations, etc, etc

Every **UI component** should use:

- ramda for all functional operations, like map, reduce, compose, etc
- ramda functions for all state changes -- no state mutations 
- snabbdom for defining HTML and SVG trees
- flyd for handling all asynchronous data (user events, ajax, etc)

There are no hard specifications on non-UI components, but in general it is preferable if they use ramda and flyd.

It is recommended but not required to use ES6. Coffeescript is generally discouraged to avoid obscuring the semantics of javascript.

Other recommendations:
- Provide GIF and linked demos for each component
- Provide full test coverage

## UI components

- A **static** UI component is one that does not change after pageload.
- A **dynamic** UI component has data and markup that changes after pageload based on asynchronous actions.

A static component must export any number of view functions.

- A **view function** is a regular javascript function that takes some data and returns a snabbdom VTree.

A dynamic component must export any number of view functions as well as an `init()` function

- An **init function** takes any parameters and returns an object of `{streams, updates, state, children}`

An object of `{streams, updates, state, children}` is called a **context**. Contexts always have this standard form:

- streams: an object of key/vals where the keys are stream names and the values are flyd streams
- updates: an object of key/vals where the keys are stream names (corresponding to the names from 'streams'), and the values are **state updater functions**
- state: a plain js object of any data
- children: an object of key/vals where the keys are child component names and the values are child **context** objects

- A view function for a dynamic UI component takes a **context** as its first parameter (and any other parameters) and returns a snabbdom VTree

Within your view functions, You can use your `context.state` to access the most recent state data, and you can use `context.streams` to use snabbdom eventlisteners to push events or other data to your streams.

The **.updates** object inside a **context** is a set of updater functions. The keys in this object map to the keys in your **.streams** object. For example:

```js
let streams = {
  s1: flyd.stream()
}
let updates = {
  s1: (val, state) => R.assoc('key', val, state)
}
```

This specifies that for every value on the stream called `s1`, we want take the value and the current state, and associate the value to a key called `'key'` within the state. **The return value of an updater function is the newly updated state**.

You can use [flimflam-render](https://github.com/jayrbolton/flimflam-render) to render your very top-level component to the page.
