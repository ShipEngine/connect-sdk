import { ono } from "@jsdevtools/ono";

/**
 * An error thrown by the ShipEngine IPaaS SDK
 */
export interface IpaasError {
  code: ErrorCode;
  transactionID?: string;
}

/**
 * Error codes for ShipEngine IPaaS runtime errors
 */
export enum ErrorCode {
  Validation = "ERR_INVALID",
  InvalidInput = "ERR_INVALID_INPUT",
  AppError = "ERR_APP_ERROR",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
}

/**
 * Additional properties to add to a ShipEngine IPaaS error
 */
export interface ErrorProps {
  originalError?: unknown;
  transactionID?: string;
  [key: string]: unknown;
}

/**
 * Creates a ShipEngine IPaaS error
 */
export function ipaasError(code: ErrorCode, message: string, { originalError, ...props }: ErrorProps = {}): IpaasError {
  let error =  ono(originalError as Error, { ...props, code }, message);
  return error;
}
