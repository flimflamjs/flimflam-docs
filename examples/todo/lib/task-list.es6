import R from 'ramda'
import h from 'snabbdom/h'
import flyd from 'flyd'

flyd.scanMerge = require('flyd/module/scanmerge')

import nav from './nav.es6'
import newTaskForm from './new-task-form.es6'
import createTask from './create-task.es6'

const log = console.log.bind(console)

function init() {
  let form = newTaskForm.init()
  let checkBox = flyd.stream()
  let changeInput = flyd.stream()
  let clickNav = flyd.stream()
  let defaultTasks = [createTask({name: "Collect all pokemon"})]

  // scanMerge all task updating streams into a single tasks stream
  let tasks = flyd.scanMerge([
    [checkBox, toggleTask]
  , [changeInput, editName]
  , [clickNav, filterByFinished]
  , [form.newTask, (tasks, t) => R.prepend(t, tasks)]
  ], defaultTasks)

  return { checkBox, changeInput, clickNav, tasks, form }
}

// if showFinished is true, then mark all finished tasks as hidden false and unfinished as hidden true
// otherwise do the opposite
function filterByFinished(tasks, showFinished) {
  const setHidden = t => R.assoc('hidden', (!t.finished && showFinished) || (t.finished && !showFinished), t)
  return R.map(setHidden, tasks)
}


// Given a task and index, toggle its finished state (from a checkbox change event)
// Toggle a task
function toggleTask(tasks, pair) {
  let [task, idx] = pair
  return R.update(idx, R.merge(task, {finished: !task.finished, hidden: !task.hidden}), tasks)
}


// Given an input change event + task object + task index
// Update that task to the new name
function editName(tasks, triple) {
  let [ev, task, idx] = triple
  let name = ev.currentTarget.value
  return R.update(idx, R.assoc('name', name, task), tasks)
}


// TODO thunk calls on this
function view(state) {
  let tasks = R.filter(t => !t.hidden, state.tasks())
  return h('div.taskList', [
    nav(state)
  , state.showingCompleted ? '' : newTaskForm.view(state.form)
  , h('ul.list', R.addIndex(R.map)(taskRow(state), state.tasks()))

  ])
}

const taskRow = state => (task, idx) => {
  if(task.hidden) return ''
  return h('li', [
    h('input', {
      props: {type: 'checkbox', checked: task.finished}
    , on: {change: [state.checkBox, [task, idx]] }
    })
  , h('input', {
      props: {type: 'text', value: task.name}
    , on: {change: ev=> {state.changeInput([ev, task, idx])}}
    })
  ])
}

module.exports = {init, view}

