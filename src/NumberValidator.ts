import OptionalNumberValidator from "./OptionalNumberValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class NumberValidator implements Validator<number> {
  metadata: Valid<number>;
  constructor(n?: OptionalNumberValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "number",
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
  optional = (): OptionalNumberValidator => {
    return new OptionalNumberValidator(this);
  };
  validate = (value: number | string, key: string = ""): number => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
    }
    if (typeof value === "string") {
      value = Number(value);
      if (Number.isNaN(value)) {
        throw new ValidationError("Invalid number", key);
      }
    }
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    if (this.metadata.min && value < this.metadata.min) {
      throw new ValidationError(`Minimum of ${this.metadata.min} required`, key);
    }
    if (this.metadata.max && value > this.metadata.max) {
      throw new ValidationError(`Maximum of ${this.metadata.max} required`, key);
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

  _getDefinitions(): Valid<number> {
    return this.metadata;
  }

  custom = (
    custom: (value: number) => ValidatorError | number
  ): NumberValidator => {
    this.metadata.custom = custom;
    return this;
  };
}