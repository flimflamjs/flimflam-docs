# 7GUIs CRUD example

> Challenges: separating the domain and presentation logic, managing mutation, building a non-trivial layout

> The task is to build a frame containing the following elements: a textfield Tprefix, a pair of textfields Tname and Tsurname, a listbox L, buttons BC, BU and BD and the three labels as seen in the screenshot. L presents a view of the data in the database that consists of a list of names. At most one entry can be selected in L at a time. By entering a string into Tprefix the user can filter the names whose surname start with the entered prefix — this should happen immediately without having to submit the prefix with enter. Clicking BC will append the resulting name from concatenating the strings in Tname and Tsurname to L. BU and BD are enabled iff an entry in L is selected. In contrast to BC, BU will not append the resulting name but instead replace the selected entry with the new name. BD will remove the selected entry. The layout is to be done like suggested in the screenshot. In particular, L must occupy all the remaining space.

> CRUD (Create, Read, Update and Delete) represents a typical graphical business application which arguably constitutes the lion's share of all GUI applications ever written. The primary challenge is the separation of domain and presentation logic in the source code that is more or less forced on the implementer due to the ability to filter the view by a prefix. Traditionally, some form of MVC pattern is used to achieve the separation of domain and presentation logic. Also, the approach to managing the mutation of the list of names is tested. A good solution will have a good separation between the domain and presentation logic without much overhead (e.g. in the form of toolkit specific concepts or language/paradigm concepts), a mutation management that is fast but not error-prone and a natural representation of the layout (layout builders are allowed, of course, but would increase the overhead).

> CRUD is directly inspired by the crud example in the blog post FRP - Three principles for GUI elements with bidirectional data flow.

[More info](https://github.com/eugenkiss/7guis/wiki#crud)

## Notes

This component uses `scanMerge` as a convenient updater of the `names$` stream, which has a stream of arrays. Create, update, and delete all get scanned and merged into a single stream of arrays of names.

This component has an example of using `R.compose` to apply multiple stream functions to a single stream. The `dataToSave` function converts a submitted form into a valid string that we can persist to memory.

We use an index for the identifier for each name when selecting and updating (because we were lazy). Using a unique ID on each name instead of an index is equally possible and would prevent some 

## Running the code

- Start the dev server with `npm run dev`
- Run the tests with `npm run test`

