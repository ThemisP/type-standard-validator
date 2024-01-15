import OptionalArrayValidator from "./OptionalArrayValidator";
import ValidationError from "./ValidationError";
import { Valid, ValidatorError, Validator } from "./Validator";

export default class ArrayValidator<T> implements Validator<any[]> {
  metadata: Valid<T[]>;
  validator: Validator<T>;
  constructor(validator: Validator<T>, n?: OptionalArrayValidator<T>) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
      this.validator = validator;
    } else {
      this.metadata = {
        type: "array",
        required: true,
        custom: [],
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
  optional = (): OptionalArrayValidator<T> => {
    return new OptionalArrayValidator(this.validator, this);
  };
  validate = (value: T[], key: string = ""): T[] => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
    }
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

  custom = (
    custom: (value: T[]) => ValidatorError | T[]
  ): ArrayValidator<T> => {
    this.metadata.custom.push(custom);
    return this;
  };
  _getDefinitions() {
    return {
      ...this.metadata,
      items: this.validator._getDefinitions(),
    }
  }
}