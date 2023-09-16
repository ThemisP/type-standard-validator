# Type Standard Validator (TSV)

[![npm version](https://badge.fury.io/js/type-standard-validator.svg)](https://www.npmjs.com/package/type-standard-validator)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a npm package attempting to replace popular validation libraries like Joi and Yup offering a better type expereince from them. The main focus of this project is to return a correctly typed value back after validation so that intelisense for JavaScript and types for TypeScript work correctly.

## Installation

You can install this package using npm or yarn:

```bash
npm install typesafe-validator
# or
yarn add typesafe-validator
```

## Usage

```javascript
const tsv = require("typescript-validator");
// this input might be the data from http request or
// dynamic data that you don't know the type of and need to
// verify / validate the structure!
const exampleInput = {
  foo: "example",
  bar: 1,
};

const objectSchema = tsv.object({
  foo: tsv.string(),
  bar: tsv.number().optional(),
});

try {
  // Example usage
  const result = objectSchema.validate(exampleInput);

  // result should have proper types and everything!
  // intelisense should work.
  // ...
} catch (err) {
  // if validation fails a ValidationError is thrown
  if (err instanceof ValidationError) {
    // do something or display error
    //...
  }
}
```

## API Reference

### `tsv.number()`

Create a number validator

**Returns:**

- (NumberValidator): A validator with some extra functions to customize

**Example:**

```javascript
const tsv = require("typescript-validator");
const schema = tsv.number();
const numberValue = schema.validate(1); // the input here
console.log(numberValue); // 1
const numberValue2 = schema.validate("2");
console.log(numberValue2); // 2 casts valid number strings to number
const notNumber = schema.validate("example"); // throws ValidationError
```

### `tsv.string()`

Create a string validator

**Returns:**

- (StringValidator): A validator with some extra functions to customize

**Example:**

```javascript
const tsv = require("typescript-validator");
const schema = tsv.string();
const stringValue = schema.validate("test"); // the input here
console.log(stringValue); // test
const errorValue = schema.validate(2); // throws ValidationError
```

### `tsv.array(itemsValidator)`

Create an array validator

**Parameters:**

- `itemsValidator` (Validator): Any valid Validator describing the items within the array;

**Returns:**

- (ArrayValidator): A validator with some extra functions to customize

**Example:**

```javascript
const tsv = require("typescript-validator");
const schema = tsv.array(tsv.number());
const arrayValue = schema.validate([]); // the input here
console.log(arrayValue); // []
const arrayValue2 = schema.validate([1, "2", 3]); // the input here
console.log(arrayValue2); // [1, 2, 3] - remember number validator can cast valid number strings to numbers
const errorValue = schema.validate([1, "test"]); // throws ValidationError
```

### `tsv.object(structure)`

Create an object validator

**Parameters:**

- `structure` ({ [key]: Valitator }): An object with the expected keys and for each key a valid validator

**Returns:**

- (ObjectValidator): A validator with some extra functions to customize

**Example:**

```javascript
const tsv = require("typescript-validator");
const objectSchema = tsv.object({
  foo: tsv.string(),
  bar: tsv.number().optional(),
});

const result = objectSchema.validate({
  foo: "test",
});
console.log(result); // { foo: "test" }
const result2 = objectSchema.validate({
  foo: "test",
  bar: 1,
});
console.log(result2); // { foo: "test", bar: 1 }
const result3 = objectSchema.validate({
  foo: "test",
  bar: "wrong",
}); // throws ValidationError
```

## Contributions

Please create a changeset file for your changes before you sumbit a pull request.

```
  npx changeset
```
