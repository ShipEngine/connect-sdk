import type { UUID } from "./types";

/**
 * Session data that may include auth data set by a data driven auth processes.
 * May include arbitrary data set by the developer.
 * Must be JSON serializable. Any method may update the session data,
 * such as renewing a session token or updating a timestamp.
 */
export type Session<T extends object = object> = T & {
  /**
  * Auth object set by a data driven auth processes.
  */
  readonly auth?: {
    /**
     * Populated by the data driven auth processes for basic auth integrations.
     */
    readonly username?: string;

    /**
     * Populated by the data driven auth processes for basic auth integrations.
     */
    readonly password?: string;

    /**
     * Populated by the data driven auth processes for OAuth integrations.
     */
    readonly accessToken?: string;

    /**
     * Populated by the data driven auth processes for API Key integrations.
     */
    readonly apiKey?: string;
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
   * Represents the desired language of the request.
   * This property should be a string that contains a BCP 47 language tag (e.g. en-US, en-GB).
   */
  readonly language?: string;

  /**
   * Session data that may include auth data set by a data driven auth processes.
   * May include arbitrary data set by the developer.
   * Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  session: Session<T>;
}
