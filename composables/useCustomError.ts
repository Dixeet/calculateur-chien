interface ErrorSearchParam {
  name: string;
  value: any;
}

interface ErrorReason {
  entity: string;
  searchParams?: ErrorSearchParam[];
}

interface CustomErrorOptions {
  notify: boolean;
  stopPropagation: boolean | 'logError';
  timeout?: number;
  type?: 'error' | 'warning' | 'info';
  reason?: ErrorReason;
}

interface ValidatorError {
  name: string;
  type: 'required' | 'min' | 'max' | 'custom';
  value: boolean | number | string;
}
class CustomError extends Error {
  customOptions: CustomErrorOptions;
  constructor(
    message = 'Custom Error',
    customOptions: CustomErrorOptions = {
      notify: false,
      stopPropagation: false,
      type: 'error',
    },
    options?: { cause?: Error },
  ) {
    super(message, options);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
    this.name = 'CustomError';
    this.customOptions = customOptions;
  }
}

class NotFoundError extends CustomError {
  constructor(
    message = 'Not Found',
    customOptions?: Partial<CustomErrorOptions>,
    options?: { cause?: Error },
  ) {
    super(
      message,
      { notify: true, stopPropagation: false, type: 'error', ...customOptions },
      options,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = 'NotFoundError';
  }
}

class DuplicateError extends CustomError {
  constructor(
    message = 'Duplicate',
    customOptions?: Partial<CustomErrorOptions>,
    options?: { cause?: Error },
  ) {
    super(
      message,
      { notify: true, stopPropagation: false, type: 'error', ...customOptions },
      options,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DuplicateError);
    }
    this.name = 'DuplicateError';
  }
}

class ValidationError extends CustomError {
  validator;

  constructor(
    message = '',
    customOptions?: Partial<CustomErrorOptions> & {
      validator?: ValidatorError;
    },
    options?: { cause?: Error },
  ) {
    if (!message && customOptions?.validator) {
      switch (customOptions.validator.type) {
        case 'required':
          message = `${customOptions.validator.name} is required`;
          break;
        case 'min':
          message = `${customOptions.validator.name} should be >= ${customOptions.validator.value}`;
          break;
        case 'max':
          message = `${customOptions.validator.name} should be <= ${customOptions.validator.value}`;
          break;
        case 'custom':
          message = `${customOptions.validator.name} does not respect custom validator (${customOptions.validator.value})`;
          break;
      }
    }
    super(
      message,
      { notify: true, stopPropagation: false, type: 'error', ...customOptions },
      options,
    );
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.name = 'ValidationError';
    this.validator = customOptions?.validator;
  }
}

export {
  CustomError,
  NotFoundError,
  DuplicateError,
  ValidationError,
  type ValidatorError,
};
