export interface ValidationErrorDetails {
  path: string;
  message: string;
}

class ValidationError extends Error {
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

export default ValidationError;
