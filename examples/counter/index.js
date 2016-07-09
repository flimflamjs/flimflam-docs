import flyd from 'flyd'
import h from 'snabbdom/h'
import R from 'ramda'
import snabbdom from 'snabbdom'
import render from 'flimflam-render'

function init() {
  let add = flyd.stream()
  let sum = flyd.scan(R.add, 0, add)
  return {add, sum}
}

function view(state) {
  return h('div', [
    h('p', `The total count is ${state.sum()}`)
  , h('button', {on: {click: [state.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [state.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [state.add, -state.sum()]}}, 'Reset!')
  ])
}

const patch = snabbdom.init([
  require('snabbdom/modules/eventlisteners')
])

render({
  view, patch
, container: document.body
, state: init()
})

