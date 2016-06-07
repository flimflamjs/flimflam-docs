import R from 'ramda'
import h from 'snabbdom/h'

// TODO thunk this
function nav(state) {
  let completed = R.filter(R.prop('finished'), state.tasks()).length
  let todo = state.tasks().length - completed
  return h('ul.nav', [
    h('li', [
      h('a', {on: {click: [state.clickNav, false]}, props: {href: '#todo'}}, 'Todo')
    , h('p', `(${todo} total)`)
    ])
  , h('li', [
      h('a', {on: {click: [state.clickNav, true]}, props: {href: '#completed'}}, 'Completed')
    , h('p', `(${completed} total)`)
    ])
  ])
}

module.exports = nav

