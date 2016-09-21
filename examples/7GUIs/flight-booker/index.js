import R from 'ramda'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'
import serialize from 'form-serialize'
import moment from 'moment'
import flyd from 'flyd'
import flyd_lift from 'flyd/module/lift'

function init() {
  let state = {
    type$: flyd.stream('one-way')
  , keyupDeparture$: flyd.stream()
  , keyupReturn$: flyd.stream()
  , submit$: flyd.stream()
  }

  // Convert input change event obj to moment date
  const toMoment = ev => moment(ev.currentTarget.value, 'DD.MM.YYYY', true)
  // Validate that an input change event has a valid date
  const dateIsInvalid = ev => ev.currentTarget.value && !toMoment(ev).isValid()
  // Stream of departure dates entered by the user
  const departureDate$ = flyd.map(toMoment, state.keyupDeparture$)
  // Stream of return dates entered by the user
  const returnDate$ = flyd.map(toMoment, state.keyupReturn$)
  state.departureInvalid$ = flyd.map(dateIsInvalid, state.keyupDeparture$)
  state.returnInvalid$ = flyd.map(dateIsInvalid, state.keyupReturn$)

  state.notBeforeReturn$ = flyd_lift(
    (ret, dep, type) => type === 'round-trip' && !dep.isBefore(ret)
  , returnDate$
  , departureDate$
  , state.type$ )
  flyd.map(console.log.bind(console), state.notBeforeReturn$)

  const formData$ = flyd.map(form => serialize(form, {hash: true}), state.submit$)
  state.successMessage$ = flyd.map(formatSuccessMessage, formData$)
  return state
}

function formatSuccessMessage(data) {
  let prefix = `You have booked a ${data.type} flight`
  return data.type === 'round-trip'
    ? `${prefix}, departing ${data.departureDate} and returning ${data.returnDate}`
    : `${prefix} for ${data.departureDate}`
}

function view(state) {
  return h('body', [
    h('form', {
      on: {submit: ev => {ev.preventDefault(); state.submit$(ev.currentTarget)}}
    }, [
      h('select', { 
        on: {change: ev => state.type$(ev.currentTarget.value)}
      , props: {name: 'type'}
      }, [
        h('option', {props: {value: 'one-way'}}, 'one-way flight')
      , h('option', {props: {value: 'round-trip'}}, 'return flight')
      ])
    , h('br')
    , h('input', {
        props: {
          name: 'departureDate'
        , type: 'text'
        , placeholder: 'Departure date (DD.MM.YYYY)'
        }
      , style: {background: state.departureInvalid$() ? 'red' : ''}
      , on: {keyup: state.keyupDeparture$}
      })
    , h('br')
    , h('input', {
        props: {
          name: 'returnDate'
        , type: 'text'
        , placeholder: state.type$() === 'one-way' ? 'No return date' : 'Return date (DD.MM.YYYY)'
        , disabled: state.type$() === 'one-way'
        }
      , style: {background: state.returnInvalid$() ? 'red' : ''}
      , on: {keyup: state.keyupReturn$}
      })
    , h('br')
    , h('button', {props: {disabled: state.returnInvalid$() || state.departureInvalid$() || state.notBeforeReturn$()}}, 'Book')
    ])
  , h('p', state.successMessage$() || 'No flight booked yet.')
  ])
}


const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/style')])

render({
  container: document.body
, state: init()
, patch, view
})

