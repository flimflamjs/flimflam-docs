import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import assert from 'assert'
import {init, view} from '../'

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props')])

function initComponent() {
  let container = document.createElement('div')
  let state = init()
  let streams = render({state, container, patch, view})
  streams.state = state
  return streams
}

function getInputs(dom) {
  return {
    fahrenInput: dom.querySelector('.fahrenInput')
  , celsiusInput: dom.querySelector('.celsiusInput')
  }
}

suite('temperature-converter')

test('212 fahren is 100 celsius', () => {
  let streams = initComponent()
  let keyup = new Event('keyup')
  let {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  fahrenInput.value = 212 ; fahrenInput.dispatchEvent(keyup)
  assert.equal(celsiusInput.value, 100)
})
test('32 fahren is 0 celsius', () => {
  let streams = initComponent()
  let keyup = new Event('keyup')
  let {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  fahrenInput.value = 32 ; fahrenInput.dispatchEvent(keyup)
  assert.equal(celsiusInput.value, 0)
})
test('0 celsius is 32 fahren', () => {
  let streams = initComponent()
  let keyup = new Event('keyup')
  let {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  celsiusInput.value = 0 ; celsiusInput.dispatchEvent(keyup)
  assert.equal(fahrenInput.value, 32)
})
test('100 celsius is 212 fahren', () => {
  let streams = initComponent()
  let keyup = new Event('keyup')
  let {fahrenInput, celsiusInput} = getInputs(streams.dom$())
  celsiusInput.value = 100 ; celsiusInput.dispatchEvent(keyup)
  assert.equal(fahrenInput.value, 212)
})
