/**
 * Error codes for ShipEngine Connect SDK runtime errors
 */
export enum ErrorCode {
  AppError = "ERR_APP_ERROR",
  BadRequest = "ERR_BAD_REQUEST",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
  ExternalServiceError = "ERR_EXTERNAL_SERVICE_ERROR",
  Filesystem = "ERR_FILESYSTEM",
  InvalidInput = "ERR_INVALID_INPUT",
  NotFound = "ERR_NOT_FOUND",
  RateLimit = "ERR_RATE_LIMIT",
  Syntax = "ERR_SYNTAX",
  Unauthorized = "ERR_UNAUTHORIZED",
  Validation = "ERR_INVALID",
}

/**
 * This method is used to create field errors which are used in various errors.
 *
 * @param {string} attemptedValue The value the user supplied.
 * @param {string} errorCode An error code if one is applicable.
 * @param {string} errorMessage The useful error message to return to the user.
 * @param {string} fieldName The name of the field that is failing to validate.
 */
export interface FieldError {
  attemptedValue?: string;
  errorCode?: string;
  errorMessage?: string;
  fieldName?: string;
}

export enum ErrorSource {
  External = "external",
  Internal = "internal",
}

export interface AppError extends Error {
  message: string;
  canBeRetried?: boolean;
  code: ErrorCode;
  originalError?: Error;
  source?: ErrorSource;
  statusCode?: number;
  transactionID?: string;
}

abstract class BaseError extends Error implements AppError {
  public code: ErrorCode;
  public source?: ErrorSource;
  public statusCode?: number;
  public canBeRetried?: boolean;
  public originalError?: Error;
  public transactionID?: string;

  public constructor(args: string | AppError) {
    if (typeof args === "string") {
      super(args);
      this.code = ErrorCode.AppError;
    }
    else {
      super(args.message);
      this.code = args.code;
      this.source = args.source;
      this.statusCode = args.statusCode;
      this.canBeRetried = args.canBeRetried;
      this.originalError = args.originalError;
      this.transactionID = args.transactionID;
    }
  }
}

interface BadRequestErrorArgs extends AppError {
  fieldErrors?: FieldError[];
}

/**
 * A Bad Request Error.
 *
 * @param {Error} args.originalError The original error if one exist.
 * @param {FieldError[]} args.fieldErrors An array of objects created by the CreateFieldError function.
 * @param {string} args.message The message that needs to be communicated to the users.
 * @param {string} args.transactionID The transaction ID associated with the function call.
 */
export class BadRequestError extends BaseError {
  public fieldErrors?: FieldError[];

  public constructor(args: string | BadRequestErrorArgs) {
    super(args);
    this.canBeRetried = false;
    this.code = ErrorCode.BadRequest;
    this.source = ErrorSource.External;
    this.statusCode = 400;
    this.name = "BadRequestError";

    if (typeof args === "object") {
      this.fieldErrors = args.fieldErrors;
    }
  }
}

/**
 * An Unauthorized Error.
 *
 * @param {Error} args.originalError The original error if one exist.
 * @param {string} args.message The message that needs to be communicated to the users.
 * @param {string} args.transactionID The transaction ID associated with the function call.
 */
export class UnauthorizedError extends BaseError {
  public constructor(args: string | AppError) {
    super(args);

    this.canBeRetried = false;
    this.code = ErrorCode.Unauthorized;
    this.source = ErrorSource.External;
    this.statusCode = 401;
    this.name = "UnauthorizedError";
  }
}

/**
 * A Resource Not Found Error.
 *
 * @param {Error} args.originalError The original error if one exist.
 * @param {string} args.message The message that needs to be communicated to the users.
 * @param {string} args.transactionID The transaction ID associated with the function call.
 */
export class NotFoundError extends BaseError {

  public constructor(args: string | AppError) {
    super(args);

    this.canBeRetried = false;
    this.code = ErrorCode.NotFound;
    this.source = ErrorSource.External;
    this.statusCode = 404;
    this.name = "NotFoundError";
  }
}

interface RateLimitErrorArgs extends AppError {
  retryInMilliseconds?: number;
}

/**
 * A Rate Limit Error.
 *
 * @param {Error} args.originalError The original error if one exist.
 * @param {number} args.retryInMilliseconds The number of milliseconds until the request can be retried.
 * @param {string} args.message The message that needs to be communicated to the users.
 * @param {string} args.transactionID The transaction ID associated with the function call.
 */
export class RateLimitError extends BaseError {
  public retryInMilliseconds?: number;

  public constructor(args: string | RateLimitErrorArgs) {
    super(args);
    this.canBeRetried = true;
    this.code = ErrorCode.RateLimit;
    this.source = ErrorSource.External;
    this.statusCode = 429;
    this.name = "RateLimitError";

    if (typeof args === "object") {
      this.retryInMilliseconds = args.retryInMilliseconds;
    }
  }
}

interface ExternalServiceErrorArgs extends AppError {
  externalErrors?: string[];
  externalWarnings?: string[];
}

/**
 * An External Service Error Error.
 *
 * @param {Error} args.originalError The original error if one exist.
 * @param {string[]} externalErrors An array of errors from the outside world.
 * @param {string[]} externalWarnings An array of warnings from the outside world.
 * @param {string} args.message The message that needs to be communicated to the users.
 * @param {string} args.transactionID The transaction ID associated with the function call.
 */
export class ExternalServiceError extends BaseError {
  public externalErrors?: string[];
  public externalWarnings?: string[];

  public constructor(args: string | ExternalServiceErrorArgs) {
    super(args);
    this.canBeRetried = true;
    this.code = ErrorCode.ExternalServiceError;
    this.source = ErrorSource.External;
    this.statusCode = 520;
    this.name = "ExternalServiceError";

    if (typeof args === "object") {
      this.externalErrors = args.externalErrors;
      this.externalWarnings = args.externalWarnings;
    }
  }
}
