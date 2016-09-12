# 7GUIs Timer Example

Challenges: working with concurrency, working with competing user/signal interactions, keeping the application responsive

> The task is to build a frame containing a gauge G for the elapsed time e, a label which shows the elapsed time as a numerical value, a slider S by which the duration d of the timer can be adjusted while the timer is running and a reset button R. Adjusting S must immediately reflect on d and not only when S is released. It follows that while moving S the filled amount of G will (usually) change immediately. When e ≥ d is true then the timer stops (and G will be full). If, thereafter, d is increased such that d > e will be true then the timer restarts to tick until e ≥ d is true again. Clicking R will reset e to zero.

> Timer deals with concurrency in the sense that a timer process that updates the elapsed time runs concurrently to the user's interactions with the GUI application. This also means that the solution to competing user and signal interactions is tested. The fact that slider adjustments must be reflected immediately moreover tests the responsiveness of the solution. A good solution will make it clear that the signal is a timer tick and, as always, has not much scaffolding.

> Timer is directly inspired by the timer example in the paper Crossing State Lines: Adapting Object-Oriented Frameworks to Functional Reactive Languages.

## Notes

This one is a great example of some flyd stream finessing, combining usage of flyd.every, scanMerge, flatMap, sampleOn, and lift, coming together to create dynamic timer behavior that changes on the fly.

scanMerge is the Multitool of stream programming. It can be thought of as a switchboard of updates, useful when you want to combine a bunch of different streams into a single stream using a running accumulator. It can even be used to make updaters for entire portions of your GUI, with a syntax style somewhat similar to Redux's reducers. 

This general formula is great for creating timers based on a reset button

```js
// Flyd timer example
const pause$ = flyd.stream() // Input stream: pause the timer
const play$ = flyd.stream() // Input stream: start the timer where it left off
const reset$ = flyd.stream() // Input stream: reset timer to 0

// Initialize the timer stream which fires ticks every 1s
// For every play action, create a flyd.every stream.
// For every pause action, end the last flyd.every stream
const timer$ = flyd.flatMap(
  ()=> flyd.endsOn(pause$, flyd.every(1000))
, play$ )

// Now let's create a stream that actually counts up and resets
const secondsElapsed$ = flyd.scanMerge([
  [timer$, R.inc] // increment the counter on every tick
, [reset$, R.always(0)] // reset to 0
], 0) // start at 0 on pageload
```

## Running the code

First, npm install. Then serve the component with:

```sh
npm run dev
```

Run the tests:

```sh
npm run test
```


