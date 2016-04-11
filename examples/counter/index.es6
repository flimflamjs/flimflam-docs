import flyd from 'flyd'
import h from 'snabbdom/h'
import R from 'ramda'

import render from '../../../flimflam-render'

function init() {
  return {
    streams: { add: flyd.stream() }
  , updates: { add: (n, state) => R.assoc('count', n + state.count, state) }
  , state:   { count: 0 }
  }
}

function view(component) {
  return h('div', [
    h('p', `The total count is ${component.state.count}`)
  , h('button', {on: {click: [component.streams.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [component.streams.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [component.streams.add, -component.state.count]}}, 'Reset!')
  ])
}

let vtree$ = render(init(), view, document.body, {debug: true})

