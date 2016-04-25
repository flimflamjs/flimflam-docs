Do:
- Have full test coverage
- Have a live demo page for the component (and an animated GIF -- try using byzanz)
- Display browser compatibility information
- Use functional programming with ramda
- Use ramda functions to immutably set new state objects
- Use streams for all asynchronous data
- Make modules that are simple object dictionaries of functions without side effects
- Use ES6, browserify, babelify, budo, and other such build tools
- Leave out semicolons and write comma first
- Use const where possible

Dont:
- Use coffeescript or another transpiled language
- Use a framework or giant library like jquery or angular
- Mutate state data 
- Use callbacks or Promise objects (use streams, they are more general)
