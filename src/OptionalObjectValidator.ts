import ObjectValidator from "./ObjectValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class OptionalObjectValidator<
  TObj extends { [key: string]: any }
> implements Validator<TObj> {
  metadata: Valid<TObj>;
  validator: { [key: string]: Validator<any> };
  constructor(
    validator: { [key: string]: Validator<any> },
    n?: ObjectValidator<TObj> | OptionalObjectValidator<TObj>
  ) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
    } else {
      this.metadata = {
        type: "object",
        required: false,
        unknown: false,
        custom: [],
      };
    }
    this.validator = validator;
  }
  unknown = (
    enabled: boolean
  ): OptionalObjectValidator<TObj & { [keys: string]: any }> => {
    this.metadata.unknown = enabled;
    return new OptionalObjectValidator<TObj & { [keys: string]: any }>(this.validator, this);
  };
  validate = (value?: TObj, key: string = ""): TObj | undefined => {
    if (value === undefined) return;
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        key
      );
    }
    for (const [_key, _value] of Object.entries(value)) {
      if (_key in this.validator) {
        value[_key as keyof TObj] = this.validator[_key].validate(_value);
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
  _getDefinitions() {
    return {
      ...this.metadata,
      items: Object.entries(this.validator).reduce((acc: any, [key, validator]) => {
        acc[key] = validator._getDefinitions();
        return acc;
      }, {})
    }
  }

  custom = (
    custom: (value: TObj) => ValidatorError | TObj
  ): OptionalObjectValidator<TObj> => {
    this.metadata.custom.push(custom);
    return this;
  };
}