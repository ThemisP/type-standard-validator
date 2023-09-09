import ValidationError from "./ValidationError";

type ValidatorError = {
  message: string;
};

type Valid<T> = {
  type: string;
  required: boolean;
  unknown?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  valid?: T[];
  invalid?: T[];
  custom?:
    | ((value: T) => ValidatorError | T)
    | ((value?: T) => ValidatorError | T | undefined);
};

class Validator<T> {
  metadata: Valid<any>;
  constructor() {
    this.metadata = {
      type: typeof this,
      required: false,
    };
  }
  static object<T extends { [key: string]: Validator<any> }>(
    obj: T
  ): ObjectValidator<{
    [key in keyof T]: (typeof obj)[key] extends Validator<infer J> ? J : never;
  }> {
    return new ObjectValidator(obj);
  }
  static number(): NumberValidator {
    return new NumberValidator();
  }
  static string(): StringValidator {
    return new StringValidator();
  }
  static array<J>(items: Validator<J>): ArrayValidator<J> {
    return new ArrayValidator(items);
  }
  validate: ((value: T) => T) | ((value?: T) => T | undefined) = () => {
    throw new Error("Method not implemented.");
  };
  custom:
    | ((custom: (value: T) => ValidatorError | T) => Validator<T>)
    | ((
        custom: (value?: T) => ValidatorError | T | undefined
      ) => Validator<T>) = () => {
    throw new Error("Method not implemented.");
  };
}

class OptionalNumberValidator extends Validator<number> {
  metadata: Valid<number>;
  constructor(n?: NumberValidator) {
    super();
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
  required = (): NumberValidator => {
    return new NumberValidator(this);
  };
  optional = (): OptionalNumberValidator => {
    return this;
  };
  validate = (value?: number | string): number | undefined => {
    if (value === undefined) {
      return;
    }
    value = Number(value);
    if (Number.isNaN(value)) {
      throw new ValidationError("Invalid number", "");
    }
    if (this.metadata.type !== typeof value) {
      throw new Error("Validation Error: wrong type");
    }
    if (this.metadata.min && value < this.metadata.min) {
      throw new Error("Validation Error: min reached");
    }
    if (this.metadata.max && value > this.metadata.max) {
      throw new Error("Validation Error: max reached");
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

  custom = (
    custom: (value?: number) => ValidatorError | number | undefined
  ): OptionalNumberValidator => {
    this.metadata.custom = custom;
    return this;
  };
}

class NumberValidator extends Validator<number> {
  metadata: Valid<number>;
  constructor(n?: OptionalNumberValidator) {
    super();
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
  validate = (value: number | string): number => {
    if (value === undefined) {
      throw new ValidationError("Required", "");
    }
    value = Number(value);
    if (Number.isNaN(value)) {
      throw new ValidationError("Invalid number", "");
    }
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (this.metadata.min && value < this.metadata.min) {
      throw new ValidationError(`Minimum of ${this.metadata.min} required`, "");
    }
    if (this.metadata.max && value > this.metadata.max) {
      throw new ValidationError(`Maximum of ${this.metadata.max} required`, "");
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
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

  custom = (
    custom: (value: number) => ValidatorError | number
  ): NumberValidator => {
    this.metadata.custom = custom;
    return this;
  };
}

class OptionalStringValidator extends Validator<string> {
  metadata: Valid<string>;
  constructor(n?: StringValidator) {
    super();
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
  validate = (value?: string): string | undefined => {
    if (value === undefined) return;
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(`Minimum of ${this.metadata.min} required`, "");
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(`Maximum of ${this.metadata.max} required`, "");
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
      } else {
        return result;
      }
    }
    return value;
  };

  custom = (
    custom: (value?: string) => ValidatorError | string | undefined
  ): OptionalStringValidator => {
    this.metadata.custom = custom;
    return this;
  };
}
class StringValidator extends Validator<string> {
  metadata: Valid<string>;
  constructor(n?: OptionalStringValidator) {
    super();
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "string",
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
  optional = (): OptionalStringValidator => {
    return new OptionalStringValidator(this);
  };
  validate = (value: string): string => {
    if (value === undefined) {
      throw new ValidationError("Required", "");
    }
    if (this.metadata.type !== typeof value) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(
        `Minimum of ${this.metadata.min} characters required`,
        ""
      );
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(
        `Maximum of ${this.metadata.max} characters required`,
        ""
      );
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
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

  custom = (
    custom: (value: string) => ValidatorError | string
  ): StringValidator => {
    this.metadata.custom = custom;
    return this;
  };
}

class OptionalArrayValidator<T> extends Validator<any[]> {
  metadata: Valid<T[]>;
  validator: Validator<T>;
  constructor(validator: Validator<T>, n?: ArrayValidator<T>) {
    super();
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
  validate = (value?: T[]): T[] | undefined => {
    if (value === undefined) return value;
    if (!Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(
        `Minimum of ${this.metadata.min} elements required`,
        ""
      );
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(
        `Maximum of ${this.metadata.max} elements required`,
        ""
      );
    }

    value = value.map((v) => {
      let result = this.validator.validate(v);
      return result;
    }) as T[];
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
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
}

class ArrayValidator<T> extends Validator<any[]> {
  metadata: Valid<T[]>;
  validator: Validator<T>;
  constructor(validator: Validator<T>, n?: OptionalArrayValidator<T>) {
    super();
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
      this.validator = validator;
    } else {
      this.metadata = {
        type: "array",
        required: true,
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
  validate = (value: T[]): T[] => {
    if (value === undefined) {
      throw new ValidationError("Required", "");
    }
    if (!Array.isArray(value)) {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (this.metadata.min && value.length < this.metadata.min) {
      throw new ValidationError(
        `Minimum of ${this.metadata.min} elements required`,
        ""
      );
    }
    if (this.metadata.max && value.length > this.metadata.max) {
      throw new ValidationError(
        `Maximum of ${this.metadata.max} elements required`,
        ""
      );
    }

    value = value.map((v) => {
      let result = this.validator.validate(v);
      return result;
    }) as T[];
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
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

  custom = (
    custom: (value?: T[]) => ValidatorError | T[] | undefined
  ): ArrayValidator<T> => {
    this.metadata.custom = custom;
    return this;
  };
}

class OptionalObjectValidator<
  TObj extends { [key: string]: any }
> extends Validator<TObj> {
  metadata: Valid<Object>;
  validator: { [key: string]: Validator<any> };
  constructor(
    validator: { [key: string]: Validator<any> },
    n?: ObjectValidator<TObj> | OptionalObjectValidator<TObj>
  ) {
    super();
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = false;
    } else {
      this.metadata = {
        type: "object",
        required: false,
        unknown: false,
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
  validate = (value?: TObj): TObj | undefined => {
    if (value === undefined) return;
    if (typeof value !== "object") {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    for (const [_key, _value] of Object.entries(value)) {
      if (_key in this.validator) {
        value[_key as keyof TObj] = this.validator[_key].validate(_value);
      } else if (!this.metadata.unknown) {
        throw new ValidationError(`Unknown key not allowed ${_key}`, "");
      }
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value) as
        | TObj
        | undefined
        | ValidationError;
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
      } else {
        return result;
      }
    }
    return value;
  };
  custom = (
    custom: (value?: TObj) => ValidatorError | TObj | undefined
  ): OptionalObjectValidator<TObj> => {
    this.metadata.custom = custom as (
      value?: Object
    ) => ValidatorError | Object | undefined;
    return this;
  };
}

class ObjectValidator<
  TObj extends { [key: string]: any }
> extends Validator<TObj> {
  metadata: Valid<Object>;
  validator: { [key: string]: Validator<any> };
  constructor(
    validator: { [key: string]: Validator<any> },
    n?: OptionalObjectValidator<TObj> | ObjectValidator<TObj>
  ) {
    super();
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "object",
        required: true,
        unknown: false,
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
  validate = (value: TObj): TObj => {
    if (value === undefined) {
      throw new ValidationError("Required", "");
    }
    if (typeof value !== "object") {
      throw new ValidationError(
        `Invalid type expected: ${this.metadata.type}`,
        ""
      );
    }
    if (
      Object.entries(this.validator).some(
        ([key, validator]) => validator.metadata.required && !(key in value)
      )
    ) {
      throw new ValidationError("Missing required keys", "");
    }

    for (const [_key, _value] of Object.entries(value)) {
      if (_key in this.validator) {
        value[_key as keyof TObj] = this.validator[_key].validate(_value);
      } else if (!this.metadata.unknown) {
        throw new ValidationError(`Unknown key not allowed ${_key}`, "");
      }
    }
    if (this.metadata.custom) {
      const result = this.metadata.custom(value) as
        | ValidationError
        | TObj
        | undefined;
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, "");
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
  custom = (
    custom: (value: TObj) => ValidatorError | TObj
  ): ObjectValidator<TObj> => {
    this.metadata.custom = custom as (
      value?: Object
    ) => ValidatorError | Object | undefined;
    return this;
  };
}

export default Validator;
export type TValidator<T> = Validator<T>;
