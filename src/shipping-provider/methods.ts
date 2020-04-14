import { PickupCancellationConfirmationConfig, PickupConfirmationConfig, RateQuoteConfig } from "../config";
import { LabelConfirmationConfig } from "../config/label-confirmation-config";
import { Transaction } from "../transaction";
import { UrlString } from "../types";
import { LabelSpec } from "./labels/label-spec";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { TrackingCriteria } from "./tracking/tracking-criteria";

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
export type CreateLabel = (transaction: Transaction, label: LabelSpec)
  => LabelConfirmationConfig | Promise<LabelConfirmationConfig>;

/**
 * Voids a previously-created shipping label
 */
export type VoidLabel = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Gets shipping rates for a shipment
 */
export type GetRates = (transaction: Transaction, criteria: RateCriteria) => RateQuoteConfig | Promise<RateQuoteConfig>;

/**
 * Returns the web page URL where a customer can track a shipment.
 *
 * NOTE: This method is synchronous, so it cannot perform API calls.
 * The function must contain all necessary logic for generating the tracking URL locally.
 */
export type GetTrackingURL = (transaction: Transaction, criteria: TrackingCriteria) => undefined | URL | UrlString;

/**
 * Returns tracking details for a shipment
 */
export type Track = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Creates a manifest for multiple shipments
 */
export type CreateManifest = (transaction: Transaction, params: unknown) => void | Promise<void>;
