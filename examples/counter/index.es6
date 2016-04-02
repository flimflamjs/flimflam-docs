import flyd from 'flyd'
import h from 'snabbdom/h'
import R from '../../../flyd-construct/node_modules/ramda'

flyd.flam = require('../../../flyd-construct/index.es6')


const init = ()=> ({
  streams: { add: flyd.stream() }
, updates: { add: (n, state) => R.evolve({count: R.add(n)}, state) }
, data:    { count: 0 }
})

// Our counter view (all the markup with event handler streams)
const view = state => 
  h('div', [
    h('p', `Total count: ${state.data.count}`)
  , h('button', {on: {click: [state.streams.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [state.streams.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [state.streams.add, -state.data.count]}}, 'Reset!')
  ])


// Plain HTML container node
let container = document.querySelector('#container')

let vtree$ = flyd.flam(init(), view, container, {debug: true})

