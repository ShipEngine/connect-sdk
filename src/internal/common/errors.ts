import { ErrorCode, UUID } from "../../public";

/**
 * Error codes for ShipEngine Connect SDK runtime errors
 */
export enum SystemErrorCode {
  InvalidInput = "ERR_INVALID_INPUT",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
  Syntax = "ERR_SYNTAX",          // Used by the loader
  Filesystem = "ERR_FILESYSTEM",  // Used by the loader
}

/**
 * An error thrown by the ShipEngine Connect SDK
 */
export interface SystemError extends Error {
  code: ErrorCode | SystemErrorCode;
  transactionID?: UUID;
  originalError?: Error;
  [key: string]: unknown;
}

/**
 * Additional properties to add to a an error
 */
export interface ErrorProps {
  originalError?: unknown;
  transactionID?: UUID;
  [key: string]: unknown;
}

/**
 * Creates a ShipEngine Connect SDK error
 */
export function error(code: ErrorCode | SystemErrorCode, message: string, props: ErrorProps = {}): SystemError {
  let originalError = props.originalError as SystemError | undefined;

  if (originalError) {
    message += ` ${originalError.message}`;
  }

  const error = new Error(message) as SystemError;

  // Copy all props from the original error and the user-specified props
  Object.assign(error, originalError, props);

  // Set the error code last,
  // so it overrides any code on the original error or props
  error.code = code;

  // Set the original error to the TRUE original error
  while (originalError && originalError.originalError) {
    error.originalError = originalError = originalError.originalError as SystemError;
  }

  return error;
}
