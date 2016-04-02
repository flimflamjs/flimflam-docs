import R from 'ramda'
import h from 'snabbdom/h'

// TODO thunk this
function nav(state) {
  let completed = R.filter(R.prop('finished'), state.data.tasks).length
  let todo = state.data.tasks.length - completed
  return h('ul.nav', [
    h('li', [
      h('a', {on: {click: [state.streams.clickNav, false]}, props: {href: '#todo'}}, 'Todo')
    , h('p', `(${todo} total)`)
    ])
  , h('li', [
      h('a', {on: {click: [state.streams.clickNav, true]}, props: {href: '#completed'}}, 'Completed')
    , h('p', `(${completed} total)`)
    ])
  ])
}

module.exports = nav

