class BaseError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Ensure the name is correctly set
    this.name = this.constructor.name;

    // Capture the stack trace (helps with debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
