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

/**
 * This method is used to create field errors which are used in various errors.
 *
 * @param {string} attemptedValue The value the user supplied.
 * @param {string} errorCode An error code if one is applicable.
 * @param {string} errorMessage The useful error message to return to the user.
 * @param {string} fieldName The name of the field that is failing to validate.
 */
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
  fieldErrors: FieldError[];
}

/**
 * A Bad Request Error.
 *
 * @param {string} message The message that needs to be communicated to the users.
 * @param {FieldError[]} fieldErrors An array of objects created by the CreateFieldError function.
 */
export class BadRequestError extends BaseError {
  public fieldErrors: FieldError[];

  public constructor(args: string | BadRequestErrorArgs) {
    super(args);
    this.canBeRetried = false;
    this.code = ErrorCode.BadRequest;
    this.source = ErrorSource.External;
    this.statusCode = 400;
    this.name = "BadRequestError";

    if (typeof args === "string") {
      this.fieldErrors = [];
    }
    else {
      this.fieldErrors = args.fieldErrors || [];
    }
  }
}

/**
 * An Unauthorized Error.
 *
 * @param {string} message The message that needs to be communicated to the users.
 */
export class UnauthorizedError extends BaseError {
  public code = ErrorCode.Unauthorized;
  public source = ErrorSource.External;
  public statusCode = 401;
  public canBeRetried = false;
  public originalError?: Error | undefined;
  public transactionID?: string | undefined;

  public constructor(
    message = "The request has not been applied because it lacks valid authentication credentials for the target resource.",
  ) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * A Resource Not Found Error.
 */
export class NotFoundError extends BaseError {
  public code = ErrorCode.NotFound;
  public source = ErrorSource.External;
  public statusCode = 404;
  public canBeRetried = false;
  public originalError?: Error | undefined;
  public transactionID?: string | undefined;

  public constructor(
    message = "The resource you are looking for was not found.",
  ) {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * A Rate Limit Error.
 */
export class RateLimitError extends BaseError {
  public code = ErrorCode.RateLimit;
  public source = ErrorSource.External;
  public statusCode = 429;
  public canBeRetried = true;
  public retryInMilliseconds?: number;
  public originalError?: Error | undefined;
  public transactionID?: string | undefined;

  public constructor(
    message = "The user has sent too many requests in a given amount of time.",
    retryInMilliseconds?: number,
  ) {
    super(message);
    this.name = "RateLimitError";
    this.retryInMilliseconds = retryInMilliseconds;
  }
}

/**
 * An External Service Error Error.
 *
 * @param {string} message The message that needs to be communicated to the users.
 * @param {string[]} externalWarnings An array of warnings from the outside world.
 * @param {string[]} externalErrors An array of errors from the outside world.
 */
export class ExternalServiceError extends BaseError {
  public code = ErrorCode.ExternalServiceError;
  public source = ErrorSource.External;
  public statusCode = 520;
  public canBeRetried = true;
  public externalWarnings: string[];
  public externalErrors: string[];
  public originalError?: Error | undefined;
  public transactionID?: string | undefined;

  public constructor(
    message = "The external service encountered an unexpected condition that prevented it from fulfilling the request.",
    externalWarnings?: string[],
    externalErrors?: string[]
  ) {
    super(message);
    this.name = "ExternalServiceError";
    this.externalWarnings = externalWarnings || [];
    this.externalErrors = externalErrors || [];
  }
}
