import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import assert from 'assert'
import {init, view} from '../'

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/class')])
const d1 = '22.12.2015'
const d2 = '22.12.2016'

function initComponent() {
  let container = document.createElement('div')
  let state = init()
  let streams = render({state, container, patch, view})
  streams.state = state
  return streams
}

suite('flight-booker')

test('when one-way is selected, return date input is disabled', () => {
  let streams = initComponent()
  let inp = streams.dom$().querySelector('input.returnDate')
  assert(inp.disabled)
})

test('when return is selected, return date is enabled', () => {
  let streams = initComponent()
  let drop = streams.dom$().querySelector('select')
  let change = new Event('change')
  drop.value = 'round-trip'
  drop.dispatchEvent(change)
  let inp = streams.dom$().querySelector('input.returnDate')
  assert(!inp.disabled)
})

test('when a misformatted date is entered in departure, it becomes red', () => {
  let streams = initComponent()
  let inp = streams.dom$().querySelector('input.departureDate')
  let keyup = new Event('keyup')
  inp.value = '22.22.22'
  inp.dispatchEvent(keyup)
  assert.notEqual(inp.className.indexOf('red'), -1)
})

test('when a misformatted date is entered in return, it becomes red', () => {
  let streams = initComponent()
  streams.state.type$('round-trip')
  let inp = streams.dom$().querySelector('input.returnDate')
  let keyup = new Event('keyup')
  inp.value = '22.22.22'
  inp.dispatchEvent(keyup)
  assert.notEqual(inp.className.indexOf('red'), -1)
})

test('when a formatted date is entered in departure, it is not red', () => {
  let streams = initComponent()
  let inp = streams.dom$().querySelector('input.departureDate')
  let keyup = new Event('keyup')
  inp.value = d1
  inp.dispatchEvent(keyup)
  assert.equal(inp.className.indexOf('red'), -1)
})

test('when a formatted date is entered in return, it is not red', () => {
  let streams = initComponent()
  streams.state.type$('round-trip')
  let inp = streams.dom$().querySelector('input.returnDate')
  let keyup = new Event('keyup')
  inp.value = d1
  inp.dispatchEvent(keyup)
  assert.equal(inp.className.indexOf('red'), -1)
})

test('when a date is entered in return that is less-than or equal-to the departure, the book button is disabled', () => {
  let streams = initComponent()
  streams.state.type$('round-trip')
  let inp1 = streams.dom$().querySelector('input.returnDate')
  let inp2 = streams.dom$().querySelector('input.departureDate')
  let btn = streams.dom$().querySelector('button')
  let keyup = new Event('keyup')
  inp1.value = d1
  inp2.value = d1
  inp1.dispatchEvent(keyup)
  inp2.dispatchEvent(keyup)
  assert(btn.disabled)
})

test('when a return flight is booked with valid dates, it displays successful booking text', () => {
  let streams = initComponent()
  streams.state.type$('round-trip')
  let inp1 = streams.dom$().querySelector('input.returnDate')
  let inp2 = streams.dom$().querySelector('input.departureDate')
  let btn = streams.dom$().querySelector('button')
  let p = streams.dom$().querySelector('p.bookingMessage')
  let keyup = new Event('keyup')
  let click = new Event('click')
  inp1.value = d1
  inp2.value = d2
  inp1.dispatchEvent(keyup)
  inp2.dispatchEvent(keyup)
  btn.dispatchEvent(click)
  const txt = 'You have booked a round-trip flight, departing 22.12.2015 and returning 22.12.2016'
  assert(p.textContent, txt)
})

test('when a one-way flight is booked, it displays successful booking text', () => {
  let streams = initComponent()
  let inp1 = streams.dom$().querySelector('input.returnDate')
  let btn = streams.dom$().querySelector('button')
  let p = streams.dom$().querySelector('p.bookingMessage')
  let keyup = new Event('keyup')
  let click = new Event('click')
  inp1.value = d1
  inp1.dispatchEvent(keyup)
  btn.dispatchEvent(click)
  const txt = 'You have booked a one-way flight for 22.12.2015'
  assert(p.textContent, txt)
})

