import R from 'ramda'
import h from 'snabbdom/h'
import flyd from 'flyd'

import nav from './nav.es6'
import newTaskForm from './new-task-form.es6'
import createTask from './create-task.es6'

function init() {

  let data = {
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
  return {data, children, streams, updates}
}


// Prepend a new task from newTaskForm.streams.newTask to state.tasks
function prependTask(task, data) {
  let tasks = R.prepend(task, data.tasks)
  return R.assoc("tasks", tasks, data)
}


// if showFinished is true, then mark all finished tasks as hidden false and unfinished as hidden true
// otherwise do the opposite
function filterByFinished(showFinished, data) {
  let tasks = R.map(
    t => R.assoc('hidden', (!t.finished && showFinished) || (t.finished && !showFinished), t)
  , data.tasks
  )
  return R.merge(data, {tasks, showingCompleted: showFinished})
}


// Given a task and index, toggle its finished state (from a checkbox change event)
// Toggle a task
function toggleTask(pair, data) {
  let [task, idx] = pair
  let tasks = R.update(idx, R.merge(task, {finished: !task.finished, hidden: !task.hidden}), data.tasks)
  return R.assoc('tasks', tasks, data)
}


// Given an input change event + task object + task index
// Update that task to the new name
function editName(triple, data) {
  let [ev, task, idx] = triple
  let name = ev.currentTarget.value
  let tasks = R.update(idx, R.assoc('name', name, task), data.tasks)
  return R.assoc('tasks', tasks, data)
}


// TODO thunk calls on this
function view(state) {
  let tasks = R.filter(t => !t.hidden, state.data.tasks)
  return h('div.taskList', [
    nav(state)
  , state.data.showingCompleted ? '' : newTaskForm.view(state.children.newTaskForm)
  , h('ul.list', R.addIndex(R.map)(taskRow(state), state.data.tasks))
  ])
}

const taskRow = state => (task, idx) => {
  if(task.hidden) return ''
  return h('li', [
    h('input', {
      props: {type: 'checkbox', checked: task.finished}
    , on: {change: [state.streams.checkBox, [task, idx]] }
    })
  , h('input', {
      props: {type: 'text', value: task.name}
    , on: {change: ev=> {state.streams.changeInput([ev, task, idx])}}
    })
  ])
}

module.exports = {init, view}

