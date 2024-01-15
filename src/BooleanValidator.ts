import OptionalBooleanValidator from "./OptionalBooleanValidator";
import ValidationError from "./ValidationError";
import { Valid, ValidatorError, Validator } from "./Validator";

export default class BooleanValidator implements Validator<boolean> {
  metadata: Valid<boolean>;
  constructor(n?: OptionalBooleanValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "boolean",
        required: true,
        custom: []
      };
    }
  }
  optional = (): OptionalBooleanValidator => {
    return new OptionalBooleanValidator(this);
  };
  validate = (value: boolean | string, key: string = ""): boolean => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
    }
    if (typeof value === "string") {
      if (value === "true") value = true;
      else if (value === "false") value = false;
      else throw new ValidationError("String cannot be converted to true/false", key);
    }
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }

    let finalResult = value;
    for (const custom of this.metadata.custom) {
      const result = custom(finalResult);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
      } else {
        finalResult = result;
      }
    }
    return finalResult;
  };

  _getDefinitions(): Valid<boolean> {
    return this.metadata;
  }

  custom = (
    custom: (value: boolean) => ValidatorError | boolean
  ): BooleanValidator => {
    this.metadata.custom.push(custom);
    return this;
  };
}