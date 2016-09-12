# 7GUIs Counter Component

Purpose: understanding the basic ideas of a language/toolkit and the essential scaffolding

> Counter serves as a gentle introduction to the basics of the language, paradigm and toolkit for one of the simplest GUI applications. Thus, by comparing Counter implementations one can clearly see what basic scaffolding is needed and how the very basic features work together to build a GUI application. A good solution will have very minimal scaffolding.

[More info](https://github.com/eugenkiss/7guis/wiki#counter).

## Running the code

Serve the component:

```sh
budo -l index.js -- -t [ babelify --presets babel-preset-es2015 ]
# or `npm run dev`
```

Run the tests:

```sh
zuul --local --ui mocha-qunit -- test/index.js
# or `npm run test`
```

