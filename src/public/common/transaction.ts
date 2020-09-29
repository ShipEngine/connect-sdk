import type { UUID } from "./types";

/**
 * The ShpEngine Connect passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, metadata, etc.
 */
export interface Transaction<T extends object = object> {
  /**
   * Uniquely identifies the current transaction. If the transaction is retried, then this ID will
   * remain the same. You can use this to detect/prevent duplicate operations.
   */
  readonly id: UUID;

  /**
   * Arbitrary session data. Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  session: T;
}
