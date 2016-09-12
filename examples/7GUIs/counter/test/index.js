import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import assert from 'assert'
import {init, view} from '..'

suite('counter')

function initComponent() {
  let container = document.createElement('div')
  let state = init()
  const patch = snabbdom.init([ require('snabbdom/modules/eventlisteners') ])
  let streams = render({state, container, patch, view})
  streams.state = state
  return streams
}

test("should show 0 initially", ()=> {
  let streams = initComponent()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  assert.equal(count, 0)
})
test("should show 1 when button clicked", ()=> {
  let streams = initComponent()
  streams.dom$().querySelector("button").click()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  assert.equal(count, 1)
})
test("should show 11 when button clicked 11 times", ()=> {
  let streams = initComponent()
  let btn = streams.dom$().querySelector('button')
  for(let i = 0; i < 11; ++i) btn.click()
  const count = parseInt(streams.dom$().querySelector('p').textContent)
  assert.equal(count, 11)
})
