import StringValidator from "./StringValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";


export default class OptionalStringValidator implements Validator<string> {
  metadata: Valid<string>;
  constructor(n?: StringValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
    } else {
      this.metadata = {
        type: "string",
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
  required = (): StringValidator => {
    return new StringValidator(this);
  };
  validate = (value?: string, key: string = ""): string | undefined => {
    if (value === undefined) return;
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(`Minimum of ${this.metadata.min} required`, key);
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(`Maximum of ${this.metadata.max} required`, key);
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
  _getDefinitions() {
    return this.metadata;
  }

  custom = (
    custom: (value?: string) => ValidatorError | string | undefined
  ): OptionalStringValidator => {
    this.metadata.custom = custom;
    return this;
  };
}