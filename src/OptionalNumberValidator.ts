import NumberValidator from "./NumberValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class OptionalNumberValidator implements Validator<number> {
  metadata: Valid<number>;
  constructor(n?: NumberValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
    } else {
      this.metadata = {
        type: "number",
        required: false,
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
  /**
   * Add a list of allowed values
   */
  whitelist = (valid: number[]) => {
    this.metadata.valid = valid;
    return this;
  };
  /**
   * Add a list of disallowed values
   */
  blacklist = (invalid: number[]) => {
    this.metadata.invalid = invalid;
    return this;
  };
  required = (): NumberValidator => {
    return new NumberValidator(this);
  };
  validate = (value?: number | string, key: string = ""): number | undefined => {
    if (value === undefined) {
      return;
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

    if (this.metadata.valid && !this.metadata.valid.includes(value)) {
      throw new ValidationError(
        `Invalid value, must be one of: ${this.metadata.valid.join(", ")}`,
        key
      );
    }
    if (this.metadata.invalid && this.metadata.invalid.includes(value)) {
      throw new ValidationError(
        `Invalid value, must NOT be one of: ${this.metadata.invalid.join(", ")}`,
        key
      );
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
      } else {
        return result;
      }
    }
    return value;
  };

  _getDefinitions(): Valid<number> {
    return this.metadata;
  }

  custom = (
    custom: (value?: number) => ValidatorError | number | undefined
  ): OptionalNumberValidator => {
    this.metadata.custom = custom;
    return this;
  };
}