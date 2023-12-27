import OptionalStringValidator from "./OptionalStringValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class StringValidator implements Validator<string> {
  metadata: Valid<string>;
  constructor(n?: OptionalStringValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "string",
        required: true,
      };
    }
  }
  min = (min: number) => {
    this.metadata.min = min;
    return this;
  };
  max = (max: number) => {
    this.metadata.max = max;
    return this;
  };
  optional = (): OptionalStringValidator => {
    return new OptionalStringValidator(this);
  };
  validate = (value: string, key: string = ""): string => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
    }
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(
        `Minimum of ${this.metadata.min} characters required`,
        key
      );
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(
        `Maximum of ${this.metadata.max} characters required`,
        key
      );
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
      } else {
        if (result === undefined) {
          throw new Error("Invalid custom function");
        } else {
          return result;
        }
      }
    }
    return value;
  };

  _getDefinitions() {
    return this.metadata;
  }

  custom = (
    custom: (value: string) => ValidatorError | string
  ): StringValidator => {
    this.metadata.custom = custom;
    return this;
  };
}