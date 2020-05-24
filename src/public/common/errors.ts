import type { UUID } from "./types";

/**
 * An error thrown by the ShipEngine Integration Platform SDK
 */
export interface ShipEngineError {
  code: ErrorCode;
  originalCode?: ErrorCode | string;
  transactionID?: UUID;
}

/**
 * Error codes for ShipEngine Integration Platform SDK runtime errors
 */
export enum ErrorCode {
  Filesystem = "ERR_FILESYSTEM",
  Syntax = "ERR_SYNTAX",
  Validation = "ERR_INVALID",
  InvalidInput = "ERR_INVALID_INPUT",
  AppError = "ERR_APP_ERROR",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
}
