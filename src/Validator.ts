
export type ValidatorError = {
  message: string;
};


export type Valid<T> = {
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

export default interface Validator<T> {
  metadata: Valid<T>;
  validate: ((value: T, key?: string) => T) | ((value?: T, key?: string) => T | undefined);
  custom?:
  | ((custom: (value: T) => ValidatorError | T) => Validator<T>)
  | ((
    custom: (value?: T) => ValidatorError | T | undefined
  ) => Validator<T>);
  _getDefinitions(): Valid<T>;
}