import type { UUID } from "./types";

/**
 * The ShpEngine Integration Platform passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export interface Transaction<T extends object = object> {
  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  readonly id: UUID;

  /**
   * Indicates whether the operation should use the carrier's sandbox/development API rather than
   * the normal/production API.
   *
   * If `useSandbox` is `true`, then the operation MUST NOT incur any actual costs or affect
   * production data.
   */
  readonly useSandbox: boolean;

  /**
   * Arbitrary session data. Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  session: T;
}
