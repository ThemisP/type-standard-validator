import ArrayValidator from "./ArrayValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class OptionalArrayValidator<T> implements Validator<any[]> {
  metadata: Valid<T[]>;
  validator: Validator<T>;
  constructor(validator: Validator<T>, n?: ArrayValidator<T>) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
      this.validator = validator;
    } else {
      this.metadata = {
        type: "array",
        required: false,
      };
      this.validator = validator;
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
  required = (): ArrayValidator<T> => {
    return new ArrayValidator(this.validator, this);
  };
  validate = (value?: T[], key: string = ""): T[] | undefined => {
    if (value === undefined) return value;
    if (!Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(
        `Minimum of ${this.metadata.min} elements required`,
        key
      );
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(
        `Maximum of ${this.metadata.max} elements required`,
        key
      );
    }

    value = value.map((v) => {
      let result = this.validator.validate(v);
      return result;
    }) as T[];
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

  custom = (
    custom: (value: T[]) => ValidatorError | T[]
  ): OptionalArrayValidator<T> => {
    this.metadata.custom = custom;
    return this;
  };
  _getDefinitions() {
    return {
      ...this.metadata,
      items: this.validator._getDefinitions(),
    }
  }
}