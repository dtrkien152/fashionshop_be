import { BaseError } from './index';

class BadRequestError extends BaseError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export { BadRequestError, NotFoundError, UnauthorizedError };
