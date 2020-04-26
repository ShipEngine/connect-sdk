import { ono } from "@jsdevtools/ono";

/**
 * An error thrown by the ShipEngine Integration Platform SDK
 */
export interface ShipEngineError {
  code: ErrorCode;
  transactionID?: string;
}

/**
 * Error codes for ShipEngine Integration Platform SDK runtime errors
 */
export enum ErrorCode {
  Validation = "ERR_INVALID",
  InvalidInput = "ERR_INVALID_INPUT",
  AppError = "ERR_APP_ERROR",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
}

/**
 * Additional properties to add to a an error
 * @internal
 */
export interface ErrorProps {
  originalError?: unknown;
  transactionID?: string;
  [key: string]: unknown;
}

/**
 * Creates a ShipEngine Integration Platform SDK error
 * @internal
 */
export function error(code: ErrorCode, message: string, { originalError, ...props }: ErrorProps = {}): ShipEngineError {
  let err =  ono(originalError as Error, { ...props, code }, message);
  return err;
}
