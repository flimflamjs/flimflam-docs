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

suite('circle-drawer')

// undo/redo

test('', ()=> {
})
