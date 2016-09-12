import flyd from 'flyd'
import h from 'snabbdom/h'
import R from 'ramda'
import scanMerge from 'flyd/module/scanmerge'
import snabbdom from 'snabbdom'

import render from 'flimflam-render'

// Initialize calculator component state
function init() {
  let input$ = flyd.stream() // input keyups
  let digit$ = flyd.stream() // button presses
  let op$ = flyd.stream() // button presses
  let clear$ = flyd.stream() // clear out expression

  // Single stream of current expression
  let expr$ = scanMerge([
    [input$,   (expr, i) => i]           // changing input simply sets the expr
  , [digit$,   (expr, ch) => expr + ch] // pressing a button simply appends that to the expr
  , [op$,      applyOp]
  , [clear$,   (expr, _) => '']
  ], '')

  return {input$, digit$, op$, clear$, expr$}
}

const applyOp = (expr, op) => {
  const digits = R.map(Number, expr.split(/[ _]/))
  if(digits.length > 1) {
    return String(ops[op](digits))
  } else {
    return expr
  }
}

// Dictionary of operator symbols mapped to functions that can be applied to an array of numbers
let ops = {
  '+' : R.sum
, '*' : R.reduce(R.multiply, 1)
, '/' : ns => R.reduce(R.divide, R.head(ns), R.tail(ns))
, '-' : ns => R.reduce(R.subtract, R.head(ns), R.tail(ns))
}

// Our counter view (all the markup with event handler streams)
function view(state) {
  return h('body', [
    h('h1', 'postfix calculator!')
  , h('p', 'Enter numbers first and operators last; separate numbers by spaces')
  , h('input', {
      on: {keyup: ev => state.input$(ev.currentTarget.value)}
    , props: {
        name: 'expr'
      , placeholder: 'Calculate party'
      , value: state.expr$()
      }
    })
  , h('div', [
      h('button', {on: {click: state.clear$}}, 'clear')
    , h('button', {on: {click: [state.digit$, '_']}, props: {innerHTML: '_'}})
    ])
  , h('div', R.map(btn(state.digit$), [1,2,3,4,5,6,7,8,9,0]))
  , h('div', R.map(btn(state.op$), R.keys(ops)))
  ])
}

// A single digit or operator button
const btn = stream => n => 
  h('button', {on: {click: [stream, n]}}, String(n))

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props')])
let container = document.body, state = init()
render({view, patch, container, state})

