import NumberValidator from "./NumberValidator";
import BooleanValidator from "./BooleanValidator";
import StringValidator from "./StringValidator";
import ArrayValidator from "./ArrayValidator";
import ObjectValidator from "./ObjectValidator";
import Validator from "./Validator";


export default class tsv {
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
}
