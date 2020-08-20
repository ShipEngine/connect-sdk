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
  code: ErrorCode;
  message: string;
  canBeRetried?: boolean;
  originalError?: Error;
  source?: ErrorSource;
  statusCode?: number;
  transactionID?: string;
}

/**
 * Normalize error args and apply defaults
 */
function normalizeArgs<T extends AppError>(args: string | T): AppError {
  if (typeof args === "string") {
    return {
      message: args,
      code: ErrorCode.AppError,
    } as T;
  }
  else {
    return args;
  }
}

abstract class BaseError extends Error implements AppError {
  public code: ErrorCode;
  public source?: ErrorSource;
  public statusCode?: number;
  public canBeRetried?: boolean;
  public originalError?: Error;
  public transactionID?: string;

  public constructor(args: AppError) {
    super(args.message);

    // Since this attribute is required tsc requires that it is set explicitly
    this.code = args.code;

    Object.assign(this, args);
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
    super({
      // Defaults
      canBeRetried: false,
      source: ErrorSource.External,
      statusCode: 400,

      // User-specified values override defaults
      ...normalizeArgs(args),

      // The code can not be overridden for convience classes
      code: ErrorCode.BadRequest,
      // The error name can't be overridden
      name: "BadRequestError",
    });
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
    super({
      // Defaults
      canBeRetried: false,
      source: ErrorSource.External,
      statusCode: 401,

      // User-specified values override defaults
      ...normalizeArgs(args),

      // The code can not be overridden for convience classes
      code: ErrorCode.Unauthorized,
      // The error name can't be overridden
      name: "UnauthorizedError",
    });
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
    super({
      // Defaults
      canBeRetried: false,
      source: ErrorSource.External,
      statusCode: 404,

      // User-specified values override defaults
      ...normalizeArgs(args),

      // The code can not be overridden for convience classes
      code: ErrorCode.NotFound,
      // The error name can't be overridden
      name: "NotFoundError",
    });
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
    super({
      // Defaults
      canBeRetried: true,
      source: ErrorSource.External,
      statusCode: 429,

      // User-specified values override defaults
      ...normalizeArgs(args),

      // The code can not be overridden for convience classes
      code: ErrorCode.RateLimit,
      // The error name can't be overridden
      name: "RateLimitError",
    });
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
    super({
      // Defaults
      canBeRetried: true,
      source: ErrorSource.External,
      statusCode: 520,

      // User-specified values override defaults
      ...normalizeArgs(args),

      // The code can not be overridden for convience classes
      code: ErrorCode.ExternalServiceError,
      // The error name can't be overridden
      name: "RateLimitError",
    });
  }
}
