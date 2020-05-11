import { PickupCancellationConfirmationPOJO, PickupConfirmationPOJO, RateQuotePOJO, ShipmentConfirmationPOJO } from "../../pojos/carrier";
import { TrackingInfoPOJO } from "../../pojos/carrier/tracking-info-pojo";
import { Transaction } from "../common";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { NewShipment } from "./shipments/new-shipment";
import { TrackingCriteria } from "./tracking/tracking-criteria";

/**
 * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
 */
export type CreateShipment = (transaction: Transaction, shipment: NewShipment)
  => ShipmentConfirmationPOJO | Promise<ShipmentConfirmationPOJO>;

/**
 * Voids one or more previously-created shipping labels
 */
export type VoidLabels = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Gets shipping rates for a shipment
 */
export type GetRates = (transaction: Transaction, criteria: RateCriteria) => RateQuotePOJO | Promise<RateQuotePOJO>;

/**
 * Returns tracking information for a shipment
 */
export type Track = (transaction: Transaction, criteria: TrackingCriteria) => TrackingInfoPOJO | Promise<TrackingInfoPOJO>;

/**
 * Creates a manifest for multiple shipments
 */
export type CreateManifest = (transaction: Transaction, params: unknown) => void | Promise<void>;

/**
 * Schedules a package pickup at a time and place
 */
export type SchedulePickup = (transaction: Transaction, request: PickupRequest)
  => PickupConfirmationPOJO | Promise<PickupConfirmationPOJO>;

/**
 * Cancels a previously-requested package pickup
 */
export type CancelPickup = (transaction: Transaction, cancellation: PickupCancellation)
  => void | PickupCancellationConfirmationPOJO | Promise<PickupCancellationConfirmationPOJO | void>;
