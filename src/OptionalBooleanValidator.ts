import BooleanValidator from "./BooleanValidator";
import ValidationError from "./ValidationError";
import Validator, { Valid, ValidatorError } from "./Validator";

export default class OptionalBooleanValidator implements Validator<boolean> {
  metadata: Valid<boolean>;
  constructor(n?: BooleanValidator) {
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
    } else {
      this.metadata = {
        type: "boolean",
        required: false,
      };
    }
  }
  required = (): BooleanValidator => {
    return new BooleanValidator(this);
  };
  validate = (value?: boolean | string, key: string = ""): boolean | undefined => {
    if (value === undefined) {
      return;
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new Error("Validation Error: custom error " + result.message);
      } else {
        return result;
      }
    }
    return value;
  };

  _getDefinitions(): Valid<boolean> {
    return this.metadata;
  }

  custom = (
    custom: (value?: boolean) => ValidatorError | boolean | undefined
  ): OptionalBooleanValidator => {
    this.metadata.custom = custom;
    return this;
  };
}