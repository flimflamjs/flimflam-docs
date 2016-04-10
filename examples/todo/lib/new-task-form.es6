import flyd from 'flyd'
import h from 'snabbdom/h'

import createTask from './create-task.es6'


// A stateless component that just has a stream of new tasks and a new task form

function init() {
  let streams = {submit: flyd.stream()}
  streams.newTask = getNewTask(streams.submit)
  return {streams}
}


// From a stream of form submit events, make a stream of new task objects
function getNewTask(submit$) {
  return flyd.map(
    ev => {
      ev.preventDefault()
      let task = createTask({name: ev.currentTarget.querySelector('input').value})
      ev.currentTarget.reset()
      return task
    }
  , submit$)
}


function view(component) {
  return h('form', {
    on: {submit: component.streams.submit}
  }, [
    h('input', {props: {type: 'text', name: 'name', placeholder: 'New Task'}})
  ])
}

module.exports = {init, view}
