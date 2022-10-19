export class NotFoundError extends Error {
  constructor(message = 'Not Found', options?: { cause: Error }) {
    super(message, options);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends Error {
  constructor(message = 'Duplicate', options?: { cause: Error }) {
    super(message, options);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateError);
    }
    this.name = 'DuplicateError';
  }
}

export interface ValidatorError {
  name: string;
  type: 'required' | 'min' | 'max' | 'custom';
  value: boolean | number | string;
}

export class ValidationError extends Error {
  validator;

  constructor(
    message = '',
    validator?: ValidatorError,
    options?: { cause: Error },
  ) {
    if (!message && validator) {
      switch (validator.type) {
        case 'required':
          message = `${validator.name} is required`;
          break;
        case 'min':
          message = `${validator.name} should be >= ${validator.value}`;
          break;
        case 'max':
          message = `${validator.name} should be <= ${validator.value}`;
          break;
        case 'custom':
          message = `${validator.name} does not respect custom validator (${validator.value})`;
          break;
      }
    }
    super(message, options);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.name = 'ValidationError';
    this.validator = validator;
  }
}
