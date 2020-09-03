import { AppError, ErrorCode, UUID } from "../../public";

/**
 * Error codes for ShipEngine Connect SDK runtime errors
 */
export enum SystemErrorCode {
  InvalidInput = "ERR_INVALID_INPUT",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
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
export function error(code: ErrorCode | SystemErrorCode, message: string, props: ErrorProps = {}): AppError {
  let originalError = props.originalError as AppError | undefined;

  if (originalError) {
    message += ` \n${originalError.message}`;
  }

  const error = new Error(message) as AppError;

  // Copy all props from the original error and the user-specified props
  Object.assign(error, originalError, props);

  // Set the error code last,
  // so it overrides any code on the original error or props
  error.code = code;

  // Set the original error to the TRUE original error
  while (originalError && originalError.originalError) {
    error.originalError = originalError = originalError.originalError as AppError;
  }

  return error;
}
