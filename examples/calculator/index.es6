import flyd from 'flyd'
import h from 'snabbdom/h'
import R from 'ramda'

import render from '../../../flimflam-render'

// This calculator component tracks:
//   expr: an array of numbers and operators pushed in the expression
function init() {
  let streams = {
    changeInput: flyd.stream()
  , clickNumButton: flyd.stream()
  , clickOpButton: flyd.stream()
  , clickEquals: flyd.stream()
  }
  streams.currentNum = flyd.map(ev => ev.currentTarget.value, streams.changeInput)
  let updates = {
    currentNum: R.assoc('digit')
  , clickNumButton: (d, state) => R.assoc('digit', R.append(d, state.digit), state)
  , clickOpButton: appendIf
  , clickEquals: calculate
  }
  let data = { expr: [] }
  return { streams, updates, data }
}

// Behavior:
//   clicks digit
//      last is op    -> append new num
//      last is digit -> append to existing num
//   clicks operator
//      last is num -> push op
//      last is op  -> replace op
//   clicks negative
//      last is op  -> push negative
//      last is num -> push subtract
//   clicks equal
//      last is num -> evaluate expr
//
//  keyup on digits/ops has same behavior as clicks on corresponding buttons
//
//  buttons are greyed out when they will not make a valid expr

// Display name : function
let ops = {
  '+' : R.add
, '*' : R.multiply
, '/' : R.divide
, '-' : R.subtract
}

// When the user presses the equals button,
// then evaluate the expression array
// and set the result to the display and clear the expr array
function calculate(_, state) {
  let result = R.reduce(
    (acc, x) => typeof x === 'function'
      ? [R.apply(x, acc)]
      : R.append(x, acc)
  , []
  , state.expr)[0]

  return R.merge(state, {
    digit: String(result)
  , expr: []
  })
}


// When a user presses an operator button,
// push the currently displayed digit and the operator to the expression array
// and clear the display
function pushToExpr(op, state) {
  let expr = R.compose(
    R.append(Number(state.digit))
  , R.append(op)
  )(state.expr)

  return R.merge(state, { expr, digit: '' })
}


// Our counter view (all the markup with event handler streams)
function view(component) {
  h('div', [
    h('p', `Total count: ${state.data.count}`)
  , h('button', {on: {click: [state.streams.add,  1]}}, 'Increment!')
  , h('button', {on: {click: [state.streams.add, -1]}}, 'Decrement!')
  , h('button', {on: {click: [state.streams.add, -state.data.count]}}, 'Reset!')
  ])
}


// Plain HTML container node
let container = document.querySelector('#container')

let vtree$ = flyd.flam(init(), view, container, {debug: true})

