import h from 'snabbdom/h'
import R from 'ramda'
import flyd from 'flyd'
import render from 'ff-core/render'
import snabbdom from 'snabbdom'

// The add$ stream constitutes the button clicks that increment
// The sum$ steam constitutes the running sum, starting with 0, incremented by add$
function init() {
  const add$ = flyd.stream()
  const sum$ = flyd.scan(R.inc, 0, add$)
  return {add$, sum$}
}

function view(state) {
  return h('body', [
    h('p', String(state.sum$()))
  , h('button', {on: {click: state.add$}}, 'Count!')
  ])
}

const patch = snabbdom.init([ require('snabbdom/modules/eventlisteners') ])

render({ view, patch, container: document.body, state: init()})


module.exports = {view, init}

