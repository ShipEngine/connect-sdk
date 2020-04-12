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
  InvalidConfig = "E_INVALID_CONFIG",
  InvalidInput = "E_INVALID_INPUT",
  AppError = "E_APP_ERROR",
  CurrencyMismatch = "E_CURRENCY_MISMATCH",
}
