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
  static number(): NumberValidator {
    return new NumberValidator();
  }
  static string(): StringValidator {
    return new StringValidator();
  }
  static boolean(): BooleanValidator {
    return new BooleanValidator();
  }
  static array<J>(items: Validator<J>): ArrayValidator<J> {
    return new ArrayValidator(items);
  }
  static object<T extends { [key: string]: Validator<any> }>(
    obj: T
  ): ObjectValidator<{
    [key in keyof T]: (typeof obj)[key] extends Validator<infer J> ? J : never;
  }> {
    return new ObjectValidator(obj);
  }
  validate: ((value: T, key?: string) => T) | ((value?: T, key?: string) => T | undefined) = () => {
    throw new Error("Method not implemented.");
  };
  custom:
    | ((custom: (value: T) => ValidatorError | T) => Validator<T>)
    | ((
      custom: (value?: T) => ValidatorError | T | undefined
    ) => Validator<T>) = () => {
      throw new Error("Method not implemented.");
    };
  _getDefinitions() {
    return this.metadata;
  }
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
  validate = (value: number | string, key: string = ""): number => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
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

class OptionalBooleanValidator extends Validator<boolean> {
  metadata: Valid<boolean>;
  constructor(n?: BooleanValidator) {
    super();
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

  custom = (
    custom: (value?: boolean) => ValidatorError | boolean | undefined
  ): OptionalBooleanValidator => {
    this.metadata.custom = custom;
    return this;
  };
}

class BooleanValidator extends Validator<boolean> {
  metadata: Valid<boolean>;
  constructor(n?: OptionalBooleanValidator) {
    super();
    if (n) {
      this.metadata = n.metadata;
      this.metadata.required = true;
    } else {
      this.metadata = {
        type: "boolean",
        required: true,
      };
    }
  }
  optional = (): OptionalBooleanValidator => {
    return new OptionalBooleanValidator(this);
  };
  validate = (value: boolean | string, key: string = ""): boolean => {
    if (value === undefined) {
      throw new ValidationError("Required", key);
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
        throw new ValidationError(result.message, key);
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
    custom: (value: boolean) => ValidatorError | boolean
  ): BooleanValidator => {
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value);
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
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
  _getDefinitions() {
    return {
      ...this.metadata,
      items: this.validator._getDefinitions(),
    }
  }
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value) as
        | TObj
        | undefined
        | ValidationError;
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
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
    if (this.metadata.custom) {
      const result = this.metadata.custom(value) as
        | ValidationError
        | TObj
        | undefined;
      if (!!result && typeof result == "object" && "message" in result) {
        throw new ValidationError(result.message, key);
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

export default Validator;
export type TValidator<T> = Validator<T>;
