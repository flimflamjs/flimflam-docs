import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import assert from 'assert'
import {init, view} from '..'

suite('timer')

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/style')])

function initComponent() {
  let container = document.createElement('div')
  let state = init()
  let streams = render({state, container, patch, view})
  streams.state = state
  return streams
}

test("clicking 'start' changes button text to 'reset'", ()=> {
  let streams = initComponent()
  let btn = streams.dom$().querySelector('button')
  btn.click()
  assert.equal(btn.textContent, 'Reset')
})

test("click 'start' initializes the timer to start counting", () => {
  let streams = initComponent()
  let p = streams.dom$().querySelector('.secondsElapsed')
  let btn = streams.dom$().querySelector('button')
  btn.click()
  assert(Number(p.textContent.replace('s', '')) > 0)
})

test("the progress fills based on time elapsed", done => {
  let streams = initComponent()
  let btn = streams.dom$().querySelector('button')
  let bar = streams.dom$().querySelector(".gauge-fill")
  btn.click()
  setTimeout(() => {
    const width = Number(bar.style.width.replace('%', ''))
    assert(width >= 10 && width < 15)
    done()
  }, 1000)
})

test("changing the duration during timing changes the percentage fill", done => {
  let streams = initComponent()
  let btn = streams.dom$().querySelector('button')
  let bar = streams.dom$().querySelector(".gauge-fill")
  let input = streams.dom$().querySelector('input[type=range]')
  btn.click()
  setTimeout(() => {
    input.value = 3
    let ev = new Event('input')
    input.dispatchEvent(ev)
    const width2 = Number(bar.style.width.replace('%', ''))
    assert(width2 >= 30 && width2 < 35)
    done()
  }, 1000)
})

