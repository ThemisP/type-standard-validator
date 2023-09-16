# Typesafe Validator

[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://www.npmjs.com/package/your-package-name)
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

## Contributions

Please create a changeset file for your changes before you sumbit a pull request.

```
  npx changeset
```
