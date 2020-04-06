import { PickupCancellationConfirmationConfig, PickupConfirmationConfig } from "../config";
import { Shipment } from "../shipment";
import { Transaction } from "../transaction";
import { UrlString } from "../types";
import { LabelSpec } from "./labels/label-spec";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupRequest } from "./pickups/pickup-request";

/**
 * Verifies a user's credentials and establishes or renews a session.
 *
 * NOTE: This function does not return a value. It updates the `transaction.session` property.
 */
export type Login = (transaction: Transaction) => void | Promise<void>;

/**
 * Requests a package pickup at a time and place
 */
export type RequestPickup = (transaction: Transaction, request: PickupRequest)
  => PickupConfirmationConfig | Promise<PickupConfirmationConfig>;

/**
 * Cancels a previously-requested package pickup
 */
export type CancelPickup = (transaction: Transaction, cancellation: PickupCancellation)
  => void | PickupCancellationConfirmationConfig | Promise<PickupCancellationConfirmationConfig | void>;

/**
 * Creates a shipping label
 */
export type CreateLabel = (transaction: Transaction, label: LabelSpec) => void | Promise<void>;

/**
 * Voids a previously-created shipping label
 */
export type VoidLabel = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Gets shipping rates for a shipment
 */
export type GetRates = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Returns the web page URL where a customer can track a shipment
 */
export type GetTrackingUrl = (transaction: Transaction, shipment: Shipment)
  => undefined | URL | UrlString | Promise<URL | UrlString | undefined>;

/**
 * Returns tracking details for a shipment
 */
export type Track = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Creates a manifest for multiple shipments
 */
export type CreateManifest = (transaction: Transaction, params: unknown) => void | Promise<void>;
