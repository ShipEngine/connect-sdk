import { ono } from "@jsdevtools/ono";
import { ErrorCode, ShipEngineError, UUID } from "../../public";


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
export function error(code: ErrorCode, message: string, { originalError, ...props }: ErrorProps = {}): ShipEngineError {
  // Capture the original error code
  let original = originalError as ShipEngineError | undefined;
  let originalCode = original ? original.originalCode ? original.originalCode : original.code : undefined;

  // Create a new error with:
  //  - The new error message and the original error message
  //  - The new stack trace and the original stack trace
  //  - The new properties and the original error's properties
  let err = ono(originalError as Error, { ...props, code, originalCode }, message);
  return err;
}
