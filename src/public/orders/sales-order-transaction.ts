import { Transaction } from "../common";
import { SalesOrderStatus } from "./enums";
import { SalesOrderCustomFieldMappingPOJO } from "./sales-order-time-range";

/**
 * Session data that may include auth data set by a data driven auth processes.
 * May include arbitrary data set by the developer.
 * Must be JSON serializable. Any method may update the session data,
 * such as renewing a session token or updating a timestamp.
 */
export type SalesOrderSession<T extends object = object> = T & {
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
 * The ShipEngine Connect passes this object to every method call. It provides information about the
 * transaction being performed, including authentication, configuration, metadata, etc.
 */
export interface SalesOrderTransaction<T extends object = object> extends Transaction<T> {
  /**
   * Session data that may include auth data set by a data driven auth processes.
   * May include arbitrary data set by the developer.
   * Must be JSON serializable. Any method may update the session data,
   * such as renewing a session token or updating a timestamp.
   */
  session: SalesOrderSession<T>;

  /**
   * A mapping of custom user-defined statuses to ShipEngine Connect statuses.
   *
   * Each key is a user-defined status string, and the value is the corresponding
   * ShipEngine Connect order status.
   */
  readonly statusMappings?: Readonly<{
    [key: string]: SalesOrderStatus;
  }>;

  /**
   * A mapping custom user-defined fields to RequestedFulfillmentExtensions
   */
  readonly fieldMappings?: Readonly<SalesOrderCustomFieldMappingPOJO>;
}
