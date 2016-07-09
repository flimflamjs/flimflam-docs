
// Flimflam sample todo app, similar to todoMVC
// Features
// - List tasks, tracking name, status, and timestamps
// - Complete tasks
// - Filter tasks by todo / completed
// - Count total todo/completed

import h from 'snabbdom/h'
import flyd from 'flyd'
import render from 'ff-core/render'

import taskList from './lib/task-list.es6'
import newTaskForm from './lib/new-task-form.es6'

import snabbdom from 'snabbdom'
const patch = snabbdom.init([
  require('snabbdom/modules/class')
, require('snabbdom/modules/props')
, require('snabbdom/modules/style')
, require('snabbdom/modules/eventlisteners')
])

const init = () => ({taskList: taskList.init()})

const view = state => h('div', [taskList.view(state.taskList)])

const state = init()

const streams = render({ container: document.body, patch, view, state })

