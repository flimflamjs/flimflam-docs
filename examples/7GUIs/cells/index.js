import R from 'ramda'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'

import flyd from 'flyd'

function init() {
  let state = {}
  return state
}

function view(state) {
  return h('body', [
    'hallo welt'
  ])
}

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/class')])
render({view, state: init(), container: document.body, patch})
module.exports = {init, view}
