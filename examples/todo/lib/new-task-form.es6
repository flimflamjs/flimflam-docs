import flyd from 'flyd'
import h from 'snabbdom/h'

import createTask from './create-task.es6'


function init() {
  let submit = flyd.stream()
  let newTask = flyd.map(getNewTask, submit)
  return {submit, newTask}
}


// From a stream of form submit events, make a stream of new task objects
function getNewTask(ev) {
  ev.preventDefault()
  let task = createTask({name: ev.currentTarget.querySelector('input').value})
  ev.currentTarget.reset()
  return task
}


function view(state) {
  return h('form', {on: {submit: state.submit}}, [
    h('input', {props: {type: 'text', name: 'name', placeholder: 'New Task'}})
  ])
}

module.exports = {init, view}
