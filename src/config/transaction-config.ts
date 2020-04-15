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
   * Indicates whether the operation should use the carrier's sandbox/development API rather than
   * the normal/production API.
   *
   * If the `useSandbox` is `true`, then the operation MUST NOT incur any actual costs or affect
   * production data.
   */
  useSandbox?: boolean;

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
