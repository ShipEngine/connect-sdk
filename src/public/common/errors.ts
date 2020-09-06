import { UUID } from "./types";

/**
 * Error codes for ShipEngine Connect SDK runtime errors
 */
export enum ErrorCode {
  AppError = "ERR_APP_ERROR",
  Invalid = "ERR_INVALID",
  Unauthorized = "ERR_UNAUTHORIZED",
  External = "ERR_EXTERNAL",
}


/**
 * An error that is thrown by a ShipEngine Connect app
 */
export interface AppError extends Error {
  code: ErrorCode | string;
  statusCode?: number;
  transactionID?: UUID;
  externalErrors?: string[];
  externalWarnings?: string[];
  originalError?: Error;
  [key: string]: unknown;
}


/**
 * The arguments that can be passsed to a ShipEngine Connect error constructor.
 */
export interface AppErrorArgs {
  /**
   * The error message.
   */
  message: string

  /**
   * The numeric status code associated with the error, if any.
   * For errors that originate from an HTTP request, this should be the HTTP status code
   * (e.g. 400, 404, 500, etc.)
   */
  statusCode?: number;

  /**
   * The original error that occurred, if this is a re-thrown error.
   */
  originalError?: Error;

  /**
   * Additional arbitrary properties that provide more information or context about the error.
   */
  [key: string]: unknown;
}


/**
 * An error that is thrown by a ShipEngine Connect app
 */
export class AppError extends Error implements AppError {
  public code: string;
  public statusCode?: number;
  public transactionID?: UUID;
  public originalError?: Error;

  /**
   * @param args
   * The error message, or an object with a message and other properties to assign to the error
   */
  public constructor(args: string | AppErrorArgs) {
    args = normalizeArgs(args);
    super(args.message);

    // Copy all props to the error
    Object.assign(this, args.originalError, args);

    // Don't allow these properties to be overridden
    this.code = ErrorCode.AppError;
    this.name = new.target.name;
  }
}


/**
 * An error indicating that input data is invalid or does not comply with business rules.
 */
export class ValidationError extends AppError {
  /**
   * @param args
   * The error message, or an object with a message and other properties to assign to the error
   */
  public constructor(args: string | AppErrorArgs) {
    super(args);
    this.code = ErrorCode.Invalid;
  }
}


/**
 * An error indicating that the user is unauthorized or not permitted to perform the requested action.
 */
export class UnauthorizedError extends AppError {
  /**
   * @param args
   * The error message, or an object with a message and other properties to assign to the error
   */
  public constructor(args: string | AppErrorArgs) {
    super(args);
    this.code = ErrorCode.Unauthorized;
  }
}


/**
 * The arguments that can be passsed to the `ExternalError` constructor.
 */
export interface ExternalErrorArgs extends AppErrorArgs {
  /**
   * If the external service returned one or more error messages, put them here.
   */
  externalErrors?: string[];

  /**
   * If the external service returned one or more warning messages, put them here.
   */
  externalWarnings?: string[];
}


/**
 * An error that originated from an external service, such as an API call.
 */
export class ExternalError extends AppError {
  public externalErrors!: string[];
  public externalWarnings!: string[];

  public constructor(args: string | ExternalErrorArgs) {
    super(args);
    this.externalErrors = this.externalErrors || [];
    this.externalWarnings = this.externalWarnings || [];
    this.code = ErrorCode.External;
  }
}


/**
 * Normalizes the arguments that are passed to an error's constructor
 */
function normalizeArgs<T extends AppErrorArgs>(args: string | T): T {
  if (typeof args === "string") {
    return { message: args } as T;
  }
  else {
    return args;
  }
}
