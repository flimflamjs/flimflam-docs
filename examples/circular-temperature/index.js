import flyd from 'flyd'
import h from 'snabbdom/h'
import snabbdom from 'snabbdom'
import render from 'ff-core/render'

function init() {
  let state = {
    changeCelsius$: flyd.stream()
  , changeFahren$: flyd.stream()
  }

  state.fahren$ = flyd.map(c => c * 9/5 + 32, state.changeCelsius$)
  state.celsius$ = flyd.map(f => f * 1.8 + 32, state.changeFahren$)
  return state
}

function view(state) {
  return h('body', [
    h('div', [
      h('label', 'Fahrenheit')
    , h('input', {props: {value: state.fahren$()}, on: {keyup: ev => state.changeFahren$(ev.currentTarget.value)}})
    ])
  , h('div', [
      h('label', 'Celsius')
    , h('input', {props: {value: state.celsius$()}, on: {keyup: ev => state.changeCelsius$(ev.currentTarget.value)}})
    ])
  ])
}

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props')])
render({container: document.body, state: init(), patch, view})
