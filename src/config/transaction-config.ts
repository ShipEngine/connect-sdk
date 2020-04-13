import { UUID } from "../types";

/**
 * ShpEngine IPaaS passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export interface TransactionConfig {
  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  id: UUID;

  /**
   * Arbitrary session data that was established upon logging in.
   * This object matches the structure defined by the shipping provider's login form.
   */
  session?: SessionState;
}

/**
 * Arbitrary Session data
 */
export interface SessionState {
  [key: string]: unknown;
}
