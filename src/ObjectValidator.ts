import OptionalObjectValidator from "./OptionalObjectValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class ObjectValidator<
  TObj extends { [key: string]: any }
> implements Validator<TObj> {
  metadata: Valid<TObj>;
  validator: { [key: string]: Validator<any> };
  constructor(
    validator: { [key: string]: Validator<any> },
    n?: OptionalObjectValidator<TObj> | ObjectValidator<TObj>
  ) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "object",
        required: true,
        unknown: false,
        custom: []
      };
    }
    this.validator = validator;
  }
  unknown = (
    enabled: boolean
  ): ObjectValidator<TObj & { [keys: string]: any }> => {
    this.metadata.unknown = enabled;
    return new ObjectValidator(this.validator, this);
  };
  validate = (value: TObj, key: string = ""): TObj => {
    if (value === undefined) {
      throw new ValidationError("Required", "");
    }
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    Object.entries(this.validator).forEach(
      ([key, validator]) => {
        if (validator.metadata.required && !(key in value)) {
          throw new ValidationError("Missing required keys", key);
        }
      }
    )

    for (const [_key, _value] of Object.entries(value)) {
      if (_key in this.validator) {
        value[_key as keyof TObj] = this.validator[_key].validate(_value, _key);
      } else if (!this.metadata.unknown) {
        throw new ValidationError(`Unknown key not allowed ${_key}`, key);
      }
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
  custom = (
    custom: (value: TObj) => ValidatorError | TObj
  ): ObjectValidator<TObj> => {
    this.metadata.custom.push(custom);
    return this;
  };
  _getDefinitions() {
    return {
      ...this.metadata,
      items: Object.entries(this.validator).reduce((acc: any, [key, validator]) => {
        acc[key] = validator._getDefinitions();
        return acc;
      }, {})
    }
  }
}
