import type { Transaction } from "../common";
import type { ManifestConfirmationPOJO } from "./manifests/manifest-confirmation";
import type { NewManifest } from "./manifests/new-manifest";
import type { PickupCancellation } from "./pickups/pickup-cancellation";
import type { PickupCancellationOutcomePOJO } from "./pickups/pickup-cancellation-outcome";
import type { PickupConfirmationPOJO } from "./pickups/pickup-confirmation";
import type { PickupRequest } from "./pickups/pickup-request";
import type { RatePOJO } from "./rates/rate";
import type { RateCriteria } from "./rates/rate-criteria";
import type { NewShipment } from "./shipments/new-shipment";
import type { ShipmentCancellation } from "./shipments/shipment-cancellation";
import type { ShipmentCancellationOutcomePOJO } from "./shipments/shipment-cancellation-outcome";
import type { ShipmentConfirmationPOJO } from "./shipments/shipment-confirmation";
import type { TrackingCriteria } from "./tracking/tracking-criteria";
import type { TrackingInfoPOJO } from "./tracking/tracking-info";


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
  => void | ShipmentCancellationOutcomePOJO[] | Promise<void | ShipmentCancellationOutcomePOJO[]>;


/**
 * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
 */
export type RateShipment = (transaction: Transaction, shipment: RateCriteria)
  => RatePOJO[] | Promise<RatePOJO[]>;


/**
 * Returns tracking information for a shipment
 */
export type TrackShipment = (transaction: Transaction, shipment: TrackingCriteria)
  => TrackingInfoPOJO | Promise<TrackingInfoPOJO>;


/**
 * Creates an end-of-day manifest
 */
export type CreateManifest = (transaction: Transaction, manifest: NewManifest)
  => ManifestConfirmationPOJO | Promise<ManifestConfirmationPOJO>;


/**
 * Schedules a package pickup at a time and place
 */
export type SchedulePickup = (transaction: Transaction, pickup: PickupRequest)
  => PickupConfirmationPOJO | Promise<PickupConfirmationPOJO>;


/**
 * Cancels one or more previously-requested package pickups
 */
export type CancelPickups = (transaction: Transaction, pickups: PickupCancellation[])
  => void | PickupCancellationOutcomePOJO[] | Promise<PickupCancellationOutcomePOJO[] | void>;
