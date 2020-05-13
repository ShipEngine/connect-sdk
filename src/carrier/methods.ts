import { Transaction } from "../common";
import { ManifestConfirmationPOJO } from "./manifests/manifest-confirmation-pojo";
import { NewManifest } from "./manifests/new-manifest";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationConfirmationPOJO } from "./pickups/pickup-cancellation-confirmation-pojo";
import { PickupConfirmationPOJO } from "./pickups/pickup-confirmation-pojo";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { RatePOJO } from "./rates/rate-pojo";
import { NewShipment } from "./shipments/new-shipment";
import { ShipmentCancellation } from "./shipments/shipment-cancellation";
import { ShipmentCancellationConfirmationPOJO } from "./shipments/shipment-cancellation-confirmation-pojo";
import { ShipmentConfirmationPOJO } from "./shipments/shipment-confirmation";
import { TrackingCriteria } from "./tracking/tracking-criteria";
import { TrackingInfoPOJO } from "./tracking/tracking-info";

/**
 * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
 */
export type CreateShipment = (transaction: Transaction, shipment: NewShipment)
  => ShipmentConfirmationPOJO | Promise<ShipmentConfirmationPOJO>;

/**
 * Cancels one or more shipments that were previously created. Depending on the carrier,
 * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
 */
export type CancelShipments = (transaction: Transaction, shipments: ShipmentCancellation[])
  => void | ShipmentCancellationConfirmationPOJO[] | Promise<void | ShipmentCancellationConfirmationPOJO[]>;

/**
 * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
 */
export type RateShipment = (transaction: Transaction, shipment: RateCriteria) => RatePOJO[] | Promise<RatePOJO[]>;

/**
 * Returns tracking information for a shipment
 */
export type TrackShipment = (transaction: Transaction, shipment: TrackingCriteria) => TrackingInfoPOJO | Promise<TrackingInfoPOJO>;

/**
 * Creates an end-of-day manifest
 */
export type CreateManifest = (transaction: Transaction, manifest: NewManifest)
  => void | ManifestConfirmationPOJO | Promise<void | ManifestConfirmationPOJO>;

/**
 * Schedules a package pickup at a time and place
 */
export type SchedulePickup = (transaction: Transaction, request: PickupRequest)
  => PickupConfirmationPOJO | Promise<PickupConfirmationPOJO>;

/**
 * Cancels one or more previously-requested package pickups
 */
export type CancelPickups = (transaction: Transaction, pickups: PickupCancellation[])
  => void | PickupCancellationConfirmationPOJO[] | Promise<PickupCancellationConfirmationPOJO[] | void>;
