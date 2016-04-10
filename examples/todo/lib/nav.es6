import R from 'ramda'
import h from 'snabbdom/h'

// TODO thunk this
function nav(component) {
  let completed = R.filter(R.prop('finished'), component.state.tasks).length
  let todo = component.state.tasks.length - completed
  return h('ul.nav', [
    h('li', [
      h('a', {on: {click: [component.streams.clickNav, false]}, props: {href: '#todo'}}, 'Todo')
    , h('p', `(${todo} total)`)
    ])
  , h('li', [
      h('a', {on: {click: [component.streams.clickNav, true]}, props: {href: '#completed'}}, 'Completed')
    , h('p', `(${completed} total)`)
    ])
  ])
}

module.exports = nav

