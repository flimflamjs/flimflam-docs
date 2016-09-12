# 7GUIs Temperature Converter Example

Challenges: working with bidirectional dataflow, working with user-provided text input.

> The task is to build a frame containing two textfields TC and TF representing the temperature in Celsius and Fahrenheit, respectively. Initially, both TC and TF are empty. When the user enters a numerical value into TC the corresponding value in TF is automatically updated and vice versa. When the user enters a non-numerical string into TC the value in TF is not updated and vice versa. The formula for converting a temperature C in Celsius into a temperature F in Fahrenheit is C = (F - 32) * (5/9) and the dual direction is F = C * (9/5) + 32.

> Temperature Converter increases the complexity of Counter by having a bidirectional dataflow between the Celsius and Fahrenheit value and the need to check the user input for validity. A good solution will make the bidirectional dependency very clear with minimal boilerplate code for the event-based connection of the two textfields.

> Temperature Converter is inspired by the Celsius/Fahrenheit converter from the book “Programming in Scala” but it is such a widespread example — sometimes also in the form of a currency converter — that one could give a thousand references if one liked to. The same is true for the Counter task.

[More info](https://github.com/eugenkiss/7guis/wiki#temperature-converter)

## Running the code

First, npm install. Then serve the component with:

```sh
npm run dev
```

Run the tests:

```sh
npm run test
```

