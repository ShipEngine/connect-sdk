import type { UUID } from "./types";

/**
 * An error thrown by the ShipEngine Connect SDK
 */
export interface ShipEngineError extends Error {
  code: ErrorCode;
  originalCode?: ErrorCode | string;
  transactionID?: UUID;

  /**
   * Used in combination with the `ERR_RATE_LIMIT` error code, indicates when a request
   * should be attempted again.
   */
  retryAfter?: number;
}

/**
 * Error codes for ShipEngine Connect SDK runtime errors
 */
export enum ErrorCode {
  Filesystem = "ERR_FILESYSTEM",
  Syntax = "ERR_SYNTAX",
  InvalidInput = "ERR_INVALID_INPUT",
  CurrencyMismatch = "ERR_CURRENCY_MISMATCH",
  AppError = "ERR_APP_ERROR",
  Validation = "ERR_INVALID",
  BadRequest = "ERR_BAD_REQUEST",
  Unauthorized = "ERR_UNAUTHORIZED",
  RateLimit = "ERR_RATE_LIMIT",
  ExternalServerError = "ERR_EXTERNAL_SERVER_ERROR"
}
