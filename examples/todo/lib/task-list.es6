import R from 'ramda'
import h from 'snabbdom/h'
import flyd from 'flyd'

import nav from './nav.es6'
import newTaskForm from './new-task-form.es6'
import createTask from './create-task.es6'

function init() {

  let state = {
    tasks: [ createTask({name: 'Collect all pokemon'}) ]
  }

  let children = {
    newTaskForm: newTaskForm.init()
  }

  let streams = {
    newTask: children.newTaskForm.streams.newTask
  , checkBox: flyd.stream()
  , changeInput: flyd.stream()
  , clickNav: flyd.stream()
  }
  
  let updates = {
    checkBox: toggleTask
  , changeInput: editName
  , clickNav: filterByFinished
  , newTask: prependTask
  }
  return {state, children, streams, updates}
}


// Prepend a new task from newTaskForm.streams.newTask to state.tasks
function prependTask(task, state) {
  let tasks = R.prepend(task, state.tasks)
  return R.assoc("tasks", tasks, state)
}


// if showFinished is true, then mark all finished tasks as hidden false and unfinished as hidden true
// otherwise do the opposite
function filterByFinished(showFinished, state) {
  let tasks = R.map(
    t => R.assoc('hidden', (!t.finished && showFinished) || (t.finished && !showFinished), t)
  , state.tasks
  )
  return R.merge(state, {tasks, showingCompleted: showFinished})
}


// Given a task and index, toggle its finished state (from a checkbox change event)
// Toggle a task
function toggleTask(pair, state) {
  let [task, idx] = pair
  let tasks = R.update(idx, R.merge(task, {finished: !task.finished, hidden: !task.hidden}), state.tasks)
  return R.assoc('tasks', tasks, state)
}


// Given an input change event + task object + task index
// Update that task to the new name
function editName(triple, state) {
  let [ev, task, idx] = triple
  let name = ev.currentTarget.value
  let tasks = R.update(idx, R.assoc('name', name, task), state.tasks)
  return R.assoc('tasks', tasks, state)
}


// TODO thunk calls on this
function view(component) {
  let tasks = R.filter(t => !t.hidden, component.state.tasks)
  return h('div.taskList', [
    nav(component)
  , component.state.showingCompleted ? '' : newTaskForm.view(component.children.newTaskForm)
  , h('ul.list', R.addIndex(R.map)(taskRow(component), component.state.tasks))

  ])
}

const taskRow = component => (task, idx) => {
  if(task.hidden) return ''
  return h('li', [
    h('input', {
      props: {type: 'checkbox', checked: task.finished}
    , on: {change: [component.streams.checkBox, [task, idx]] }
    })
  , h('input', {
      props: {type: 'text', value: task.name}
    , on: {change: ev=> {component.streams.changeInput([ev, task, idx])}}
    })
  ])
}

module.exports = {init, view}

