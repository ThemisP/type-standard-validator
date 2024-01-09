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
        custom: [],
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
    let finalResult = value;
    for (const custom of this.metadata.custom) {
      const result = custom(finalResult);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new Error("Validation Error: custom error " + result.message);
      } else {
        finalResult = result;
      }
    }
    return finalResult;
  };

  _getDefinitions(): Valid<boolean> {
    return this.metadata;
  }

  custom = (
    custom: (value: boolean) => ValidatorError | boolean
  ): OptionalBooleanValidator => {
    this.metadata.custom.push(custom);
    return this;
  };
}