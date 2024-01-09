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
        custom: [],
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
   * Will always convert to lowercase since email addresses are case insensitive
   */
  email = () => {
    this.metadata.custom.push((v) => {
      if (!v.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        return {
          message: "Invalid email address"
        }
      }
      return v.toLowerCase();
    });
    return this;
  }
  /**
   * Add a list of allowed values
   */
  whitelist = (valid: string[]) => {
    this.metadata.valid = valid;
    return this;
  };
  /**
   * Add a list of disallowed values
   */
  blacklist = (invalid: string[]) => {
    this.metadata.invalid = invalid;
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

  _getDefinitions() {
    return this.metadata;
  }

  custom = (
    custom: (value: string) => ValidatorError | string
  ): StringValidator => {
    this.metadata.custom.push(custom);
    return this;
  };
}