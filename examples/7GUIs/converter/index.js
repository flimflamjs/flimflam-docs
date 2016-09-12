import flyd from 'flyd'
import h from 'snabbdom/h'
import snabbdom from 'snabbdom'
import render from 'ff-core/render'

function init() {
  let state = {
    changeCelsius$: flyd.stream()
  , changeFahren$: flyd.stream()
  }

  state.fahren$ = flyd.map(celsiusToFahren, state.changeCelsius$)
  state.celsius$ = flyd.map(fahrenToCelsius, state.changeFahren$)
  return state
}

const fahrenToCelsius = f => Math.round(((f||0) - 32) * 5/9)
const celsiusToFahren = c => Math.round((c||0) * 9/5 + 32)

function view(state) {
  return h('body', [
    h('div', [
      h('label', 'Fahrenheit')
    , h('input.fahrenInput', {
        props: {type: 'number', value: state.fahren$()}
      , on: {keyup: ev => state.changeFahren$(ev.currentTarget.value)}
    })
    ])
  , h('div', [
      h('label', 'Celsius')
    , h('input.celsiusInput', {
        props: {type: 'number', value: state.celsius$()}
      , on: {keyup: ev => state.changeCelsius$(ev.currentTarget.value)}
    })
    ])
  ])
}

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props')])
render({container: document.body, state: init(), patch, view})

module.exports = {init, view}
