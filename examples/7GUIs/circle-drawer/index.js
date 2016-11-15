import R from 'ramda'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'
import flyd_undo from 'flyd-undo'
import flyd_filter from 'flyd/module/filter'
import flyd_lift from 'flyd/module/lift'
import flyd from 'flyd'

const defaultRadius = 50

function init() {
  let state = {
    clickSvg$: flyd.stream()
  , changeRadius$: flyd.stream()
  , clickUndo$: flyd.stream()
  , clickRedo$: flyd.stream()
  }

  // Filter out clicks on existing circles
  const clickBlankSvg$ = flyd_filter(
    ev => ev.target.tagName === 'svg'
  , state.clickSvg$
  )
  
  // Clicks on an actual circle svg element
  const clickCircle$ = flyd_filter(
    ev => ev.target.tagName === 'circle'
  , state.clickSvg$
  )

  // Stream of new circle objects 
  const newCircle$ = flyd.map(createCircle, clickBlankSvg$)

  // Flyd undo stateful history of a stream of arrays of circle objects
  state.circles$ = flyd_undo({
    default: []
  , undo: state.clickUndo$
  , redo: state.clickRedo$
  , actions: [
      [newCircle$, (circles, circ) => R.append(circ, circles)]
    , [state.changeRadius$, changeCircleRadius]
    ]
  })

  // Stream of selected circles ids, which includes both the new circle created on click, and old circles selected on click
  const selectedID$ = flyd.merge(
    flyd.map(ev => ev.target.getAttribute('id'), clickCircle$)
  , flyd.map(circle => circle.id, newCircle$)
  )

  // Stream of the currently selected circle object
  state.selectedCircle$ = flyd_lift(
    (id, circles) => findCirc(id, circles.current)
  , selectedID$
  , state.circles$
  )

  return state
}

// Find a circle with a given idea from a list of circle objects
const findCirc = (id, circles) =>  {
  return R.find(R.propEq('id', Number(id)), circles)
}


// Create a new circle with a unique id
let id = 0
function createCircle(clickEvent) {
  return {
    r: defaultRadius, cx: clickEvent.offsetX, cy: clickEvent.offsetY, id: ++id
  }
}


// Change the radius of a circle from the state.changeRadius$ event stream
function changeCircleRadius(circles, [ev, circ]) {
  const newRad = ev.currentTarget.value
  const newCircle = R.assoc('r', newRad, circ)
  const index = R.findIndex(R.propEq('id', circ.id), circles)
  return R.update(index, newCircle, circles)
}

// Main view function that generates the snabbdom vnode tree
function view(state) {
  const circles = state.circles$().current
  const selected = state.selectedCircle$() || {}
  const circleNodes = R.map(circleNode(selected), circles)
  return h('body', [
    h('button', {on: {click: state.clickUndo$}, props: {disabled: !state.circles$().backward.length}}, 'Undo')
  , h('button', {on: {click: state.clickRedo$}, props: {disabled: !state.circles$().forward.length}}, 'Redo')
  , h('div')
  , h('div.radiusDialog', {
      class: {'is-hidden': !selected.id}
    }, [
      h('label', `Radius (${selected.r})`)
    , h('input', {props: {type: 'range', name: 'radius', value: Number(selected.r), min: 1, max: 100}, on: {change: ev => state.changeRadius$([ev, selected])}})
    ])
  , h('svg', {attrs: {width: 500, height: 500}, on: {click: state.clickSvg$}}, circleNodes)
  ])
}

// A single svg circle element
const circleNode = selected => attrs =>
  h('circle', {
    attrs
  , class: {'is-selected': Number(selected.id) === Number(attrs.id)}
  })


// Init snabbdom and render everything to the page
const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/attributes'), require('snabbdom/modules/class')])
render({view, state: init(), container: document.body, patch})

// Like any other component, export the state init function and the top view function
module.exports = {init, view}
