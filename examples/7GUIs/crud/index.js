import R from 'ramda'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'
import serialize from 'form-serialize'

import flyd from 'flyd'
import flyd_lift from 'flyd/module/lift'
import flyd_filter from 'flyd/module/filter'
import flyd_sampleOn from 'flyd/module/sampleon'
import flyd_scanMerge from 'flyd/module/scanmerge'

R.map = R.addIndex(R.map)

const log$ = flyd.map(console.log.bind(console))

function init() {
  let state = {
    filter$: flyd.stream('')
  , selectedIdx$: flyd.stream()
  , clickCreate$: flyd.stream()
  , clickUpdate$: flyd.stream()
  , clickDelete$: flyd.stream()
  }

  // Composition of functions to take a create/update action and make it into a valid name
  const dataToSave = R.compose(
    flyd.map(obj => obj.surname + ', ' + obj.name)
  , flyd_filter(obj => obj.surname && obj.name) // reject blanks
  , flyd.map(getFormData) // form -> object
  )
  const toCreate$ = dataToSave(state.clickCreate$)
  // Sample from the currently selected index on every delete click
  const toDelete$ = flyd_sampleOn(state.clickDelete$, state.selectedIdx$)
  // Get a pair of currently selected index and new name to update on every update click
  const toUpdate$ = flyd_lift(
    R.pair
  , flyd_sampleOn(state.clickUpdate$, state.selectedIdx$)
  , dataToSave(state.clickUpdate$)
  )
  const defaultNames = ['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman']
  const names$ = flyd_scanMerge([
    [toCreate$, (names, n) => R.append(n, names)]
  , [toUpdate$, (names, [idx, n]) => R.update(idx, n, names)]
  , [toDelete$, (names, idx) => R.remove(idx, 1, names)]
  ], defaultNames)

  state.filteredNames$ = flyd_lift(filter, names$, state.filter$)

  return state
}

// Get the form from the button click, then convert the form into an object
const getFormData = ev =>
  serialize(ev.currentTarget.form, {hash: true})

// Apply the filter string as entered by the user
function filter(names, searchWord) {
  if(!searchWord || !searchWord.length) return names
  searchWord = searchWord.toLowerCase()
  return R.filter(n => n.toLowerCase().split(', ')[0].indexOf(searchWord) !== -1, names)
}


function view(state) {
  return h('body', [
    searchFilter(state)
  , h('form', {on: {submit: ev => {ev.preventDefault(); ev.stopPropagation();}}}, [
      h('ol', R.map(nameOption(state), state.filteredNames$()))
    , fields(state)
    , actions(state)
    ])
  ])
}

function searchFilter(state) {
  return h('div', [
    h('label', 'Filter by surname: ')
  , h('input.filter', {
      props: {type: 'text', name: 'filter'}
    , on: {keyup: ev => state.filter$(ev.currentTarget.value)}
    })
  ])
}

function fields(state) {
  const selected = state.filteredNames$()[state.selectedIdx$()] || ''
  return h('div', [
    h('div', [
      h('label', 'Name: ')
    , h('input.name', {props: {name: 'name', type: 'text', value: R.last(selected.split(', '))}})
    ])
  , h('div', [
      h('label', 'Surname: ')
    , h('input.surname', {props: {name: 'surname', type: 'text', value: R.head(selected.split(', '))}})
    ])
  ])
}

function actions(state) {
  return h('div', [
    h('button.create', {
      on: {click: state.clickCreate$}
    , props: {type: 'button'}
    }, "Create")
    , h('button.update', {
      on: {click: state.clickUpdate$}
    , props: {disabled: state.selectedIdx$() === undefined, type: 'button'}
    }, "Update")
    , h('button.delete', {
      on: {click: state.clickDelete$}
    , props: {disabled: state.selectedIdx$() === undefined, type: 'button'}
    }, "Delete")
  ])
}

// A single item within the listing of selectable names
const nameOption = state => (name, idx) => {
  const isMatched = state.selectedIdx$() === idx
  return h('li' , {
    on: {click: [state.selectedIdx$, isMatched ? undefined : idx]}
  , class: {selected: isMatched}
  }, name)
}

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/class')])
render({view, state: init(), container: document.body, patch})

module.exports = {init, view}
