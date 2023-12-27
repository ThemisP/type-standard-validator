export interface ValidationErrorDetails {
  path: string;
  message: string;
}

export default class ValidationError extends Error {
  details: ValidationErrorDetails;
  constructor(message: string, path: string) {
    super("Invalid Data");
    this.name = "ValidationError";
    this.details = {
      path,
      message,
    };
  }
  toJSON = () => ({
    message: this.message,
    details: this.details,
  });
}
