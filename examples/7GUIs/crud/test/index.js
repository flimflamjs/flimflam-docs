import snabbdom from 'snabbdom'
import render from 'ff-core/render'
import assert from 'assert'
import {init, view} from '../'

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/class')])

function initComponent() {
  let container = document.createElement('div')
  let state = init()
  let streams = render({state, container, patch, view})
  streams.state = state
  return streams
}

suite('crud')

test('when input is entered, people are filtered by surname', () => {
  let streams = initComponent()
  let inp = streams.dom$().querySelector('input.filter')
  inp.value = 'emil'
  let ol = streams.dom$().querySelector('ol')
  let ev = new Event('keyup')
  inp.dispatchEvent(ev)
  assert.equal(ol.textContent, 'Emil, Hans')
})

test('when a row is clicked, the name and surname inputs are filled', () => {
  let streams = initComponent()
  let li = streams.dom$().querySelectorAll('li')[1]
  let ev = new Event('click')
  li.dispatchEvent(ev)
  let inp_name = streams.dom$().querySelector('input.name')
  let inp_surname = streams.dom$().querySelector('input.surname')
  assert.equal(`${inp_name.value} ${inp_surname.value}`, 'Max Mustermann')
})

test('deselecting a selected row clears the inputs', () => {
  let streams = initComponent()
  let li = streams.dom$().querySelectorAll('li')[1]
  let ev = new Event('click')
  li.dispatchEvent(ev)
  li.dispatchEvent(ev)
  let inp_name = streams.dom$().querySelector('input.name')
  let inp_surname = streams.dom$().querySelector('input.surname')
  assert.equal(inp_name.value + inp_surname.value, '')
})

test('updating a selected name changes its entry in the list', ()=> {
  let streams = initComponent()
  let li = streams.dom$().querySelectorAll('li')[1]
  let click = new Event('click')
  li.dispatchEvent(click)
  let inp_name = streams.dom$().querySelector('input.name')
  inp_name.value = "Roger"
  let updateBtn = streams.dom$().querySelector('button.update')
  updateBtn.dispatchEvent(click)
  assert.equal(li.textContent, 'Mustermann, Roger')
})

test('creating a new name appends it to the list', () => {
  let streams = initComponent()
  let li = streams.dom$().querySelectorAll('li')[1]
  let click = new Event('click')
  li.dispatchEvent(click)
  let inp_name = streams.dom$().querySelector('input.name')
  inp_name.value = "Roger"
  let createBtn = streams.dom$().querySelector('button.create')
  createBtn.dispatchEvent(click)
  let newLI = streams.dom$().querySelectorAll('li')[3]
  assert.equal(newLI.textContent, 'Mustermann, Roger')
})

test('deleting a selected name removes it from the list', () => {
  let streams = initComponent()
  let li = streams.dom$().querySelectorAll('li')[1]
  let click = new Event('click')
  li.dispatchEvent(click)
  let deleteBtn = streams.dom$().querySelector('button.delete')
  deleteBtn.dispatchEvent(click)
  let listText = streams.dom$().querySelector('ol').textContent
  assert.equal(listText, 'Emil, HansTisch, Roman')
})
