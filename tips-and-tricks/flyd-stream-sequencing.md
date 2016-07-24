
Sometimes, you want to have the same stream trigger two events. But you want the two events to happen in sequencing, without the second one happening before the first one.

For example, say you have a submit stream that you want to both make a POST request immediately using the form data, and also clear out the form directly afterwards:

```js

function init() {
  let state = {submit$: flyd.stream()}

  // First, post the form data to the server
  const response$ = flyd.map(makePostRequest, submit$)
  // Then, reset the form
  flyd.map(clearForm, submit$)

  return state
}

function view(state) {
  return h('form', { on: {submit: state.submit$} }, [...])
}
```

This won't work, as you will likely clear out the form before you make the post request and then will have no data to post.

This is a contrived example, and this exact functionality could be achieved easily in another way. But you may find this same problem cropping up for more complicated examples.

In order to do these two actions sequentially, you can simply make a second stream that maps the idenity:


```js
function init() {
  let state = {submit$: flyd.stream()}
  const afterSubmit$ = flyd.map(R.identity, state.submit$)

  // First, post the form data to the server
  const response$ = flyd.map(makePostRequest, submit$)
  // Then, reset the form
  flyd.map(clearForm, afterSubmit$)

  return state
}

function view(state) {
  return h('form', { on: {submit: state.submit$} }, [...])
}
```

