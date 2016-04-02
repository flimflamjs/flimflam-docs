
// Flimflam sample todo app, similar to todoMVC
// Features
// - List tasks, tracking name, status, and timestamps
// - Complete tasks
// - Filter tasks by todo / completed
// - Count total todo/completed

import h from 'snabbdom/h'
import flyd from 'flyd'
import flyd_flam from '../../../flyd-construct/index.js'

import taskList from './lib/task-list.es6'
import newTaskForm from './lib/new-task-form.es6'


function init() {
  return {
    children: { taskList: taskList.init() }
  }
}


function view(state) {
  return h('div', [ taskList.view(state.children.taskList) ])
}

let vtree$ = flyd_flam(
  init()
, view
, container
, {debug: true}
)

