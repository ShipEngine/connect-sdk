import type { UUID } from "./types";

/**
 * Session data that includes auth data set by a data driven auth processes.
 * May include arbitrary data set by the developer.
 * Must be JSON serializable. Any method may update the session data,
 * such as renewing a session token or updating a timestamp.
 */
export type OAuthSession<T extends object = object> = T & {
  readonly auth: {
    /**
     * Populated by the data driven auth processes for basic auth integrations.
     */
    readonly username: string;

    /**
     * Populated by the data driven auth processes for basic auth integrations.
     */
    readonly password: string;

    /**
     * Populated by the data driven auth processes for OAuth integrations.
     */
    readonly accessToken: string;

    /**
     * Populated by the data driven auth processes for API Key integrations.
     */
    readonly apiKey: string;
  }
}

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
   * Arbitrary session data that may include Auth data when set by a data driven auth processes.
   * Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  session: T | OAuthSession;
}
