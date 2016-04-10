import flyd from 'flyd'
import h from 'snabbdom/h'
import R from 'ramda'

import render from '../../../flimflam-render'

function init() {
  return {
    streams: { add: flyd.stream() }
  , updates: { add: (n, state) => R.assoc('count', n + state.count, state) }
  , state:    { count: 0 }
  }
}

function view(component) {
  return h('body', [
    h('p', `Total count: ${component.state.count}`)
  , h('button', {}, 'Increment!')
  , h('button', {}, 'Decrement!')
  , h('button', {}, 'Reset!')
  ])
}

let vtree$ = render({}, view, document.body, {debug: true})

