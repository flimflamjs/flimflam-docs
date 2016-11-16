# flimflam specifications & recommendations

Flimflam is mostly a specification about "UI components":

- A **UI component** is a javascript module that is meant to be rendered into the browser/app and represents a part of a User Interface.
- Non-UI components are considered utility packages, and handle things like date formatting, ajax, currency calculations, etc, etc

Every **UI component** should use:

- Ramda for all functional operations, like map, reduce, compose, etc
- Ramda functions like assoc, merge, append, etc for all state changes; don't mutate objects
- snabbdom for generating HTML and SVG trees
- flyd for handling all asynchronous data (user events, ajax, etc)

There are no hard specifications on non-UI components in flimflam, but in general it is preferable if they use ramda and flyd and have a functional, non-mutating style. They must work outside of any framework and be requirable using CommonJS.

It is recommended but not required to use ES6. Coffeescript is discouraged to avoid obscuring the semantics of javascript.

Other recommendations:
- Provide linked demos for each component

Lastly, provide a full suite of tests for every module.

## UI components

- A **static** UI component is one that does not change after pageload.
- A **dynamic** UI component has data and markup that changes after pageload based on asynchronous actions.

A static component must export any number of view functions.

- A **view function** is a regular javascript function that takes some data and returns a snabbdom VTree (which can be used to produce HTML).

A dynamic component must export any number of view functions as well as an `init()` function

- An **init function** takes any parameters and returns a state object of plain values and flyd streams.
- A view function for a dynamic UI component takes a **state object** as its first parameter (plus any other parameters afterwards) and returns a snabbdom VTree

Within your view functions, You can use your `state` object to access the most recent state data to either read values or to bind event listeners to flyd streams.

Use [flimflam-render](https://github.com/jayrbolton/flimflam-render) (also included in [ff-core](https://github.com/flimflamjs/ff-core) in `ff-core/render`) to render your component to the page. Using flimflam-render is only necessary in your actual app, and not used in modules that are only UI components. In a "one-page" app, render is only called a single time for the top-most component.

