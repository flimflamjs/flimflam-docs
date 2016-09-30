import R from 'ramda'
import h from 'snabbdom/h'
import snabbdom from 'snabbdom'
import render from 'ff-core/render'

import flyd from 'flyd'
import flyd_lift from 'flyd/module/lift'
import flyd_every from 'flyd/module/every'
import flyd_flatMap from 'flyd/module/flatmap'
import flyd_sampleOn from 'flyd/module/sampleon'
import flyd_scanMerge from 'flyd/module/scanmerge'

function init() {
  let state = {change$: flyd.stream(), submit$: flyd.stream()}
  // Stream of maximum duration values in second (from range input)
  state.duration$ = flyd.merge(
    flyd.map(R.prop('value'), state.change$)
  , flyd.stream(10) // pageload default
  )

  // Streams of ticks every 100ms, started and stopped by the submit event
  const every$ = flyd_flatMap(
    ()=> flyd.endsOn(state.submit$, flyd_every(100))
  , state.submit$ )
  // Sample the current max duration for every tick, for use below
  const everyDur$ = flyd_sampleOn(every$, state.duration$)

  // Stream of second values to one decimal place, incremented by everyDur$ and reset by a submit
  state.secondsElapsed$ = flyd_scanMerge([
    [everyDur$, (s, dur) => s < dur ? Number((s + 0.1).toFixed(1)) : s]
  , [state.submit$, ()=> 0]
  ], 0)
  // Stream of percentage of secondsElapsed / duration
  state.percentageElapsed$ = flyd_lift(percentage, state.secondsElapsed$, state.duration$)
  return state
}

const percentage = (x, y) => Math.round(x * 100 / y)

function view(state) {
  return h('body', [
    h('p', 'Elapsed Time:')
  , h('div.gauge', {
      style: {height: '20px', width: '200px', overflow: 'hidden', background: '#ddd'}
    }, [
      h('div.gauge-fill', { 
        style: {
          width: (state.percentageElapsed$()||0) + '%'
        , height: '100%'
        , background: 'green'
        }
      })
    ])
  , h('p.secondsElapsed', (state.secondsElapsed$()||0).toFixed(1) + 's')
  , h('form', {
      on: {submit: ev => {ev.preventDefault(); state.submit$(ev.currentTarget)}}
    }, [
      h('label', 'Duration:')
    , h('input', {
        props: {type: 'range', min: 1, max: 60, value: 10}
      , on: {input: ev => {state.change$(ev.currentTarget)}}
      })
    , h('label', String(state.duration$()||0))
    , h('br')
    , h('button', state.secondsElapsed$() ? 'Reset' : 'Start')
    ])
  ])
}

const patch = snabbdom.init([require('snabbdom/modules/eventlisteners'), require('snabbdom/modules/props'), require('snabbdom/modules/style')])
render({view, state: init(), container: document.body, patch})

module.exports = {init, view}
