import type { Transaction } from "../common";
import type { ManifestConfirmation } from "./manifests/manifest-confirmation";
import type { NewManifest } from "./manifests/new-manifest";
import type { PickupCancellation } from "./pickups/pickup-cancellation";
import type { PickupCancellationOutcome } from "./pickups/pickup-cancellation-outcome";
import type { PickupConfirmation } from "./pickups/pickup-confirmation";
import type { PickupRequest } from "./pickups/pickup-request";
import type { Rate } from "./rates/rate";
import type { RateCriteria } from "./rates/rate-criteria";
import type { NewShipment } from "./shipments/new-shipment";
import type { ShipmentCancellation } from "./shipments/shipment-cancellation";
import type { ShipmentCancellationOutcome } from "./shipments/shipment-cancellation-outcome";
import type { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import type { TrackingCriteria } from "./tracking/tracking-criteria";
import type { TrackingInfo } from "./tracking/tracking-info";


/**
 * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
 */
export type CreateShipment = (transaction: Transaction, shipment: NewShipment)
=> ShipmentConfirmation | Promise<ShipmentConfirmation>;


/**
 * Cancels one or more shipments that were previously created. Depending on the carrier,
 * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
 */
export type CancelShipments = (transaction: Transaction, shipments: ShipmentCancellation[])
=> void | ShipmentCancellationOutcome[] | Promise<void | ShipmentCancellationOutcome[]>;


/**
 * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
 */
export type RateShipment = (transaction: Transaction, shipment: RateCriteria)
=> Rate[] | Promise<Rate[]>;


/**
 * Returns tracking information for a shipment
 */
export type TrackShipment = (transaction: Transaction, shipment: TrackingCriteria)
=> TrackingInfo | Promise<TrackingInfo>;


/**
 * Creates an end-of-day manifest
 */
export type CreateManifest = (transaction: Transaction, manifest: NewManifest)
=> ManifestConfirmation | Promise<ManifestConfirmation>;


/**
 * Schedules a package pickup at a time and place
 */
export type SchedulePickup = (transaction: Transaction, pickup: PickupRequest)
=> PickupConfirmation | Promise<PickupConfirmation>;


/**
 * Cancels one or more previously-requested package pickups
 */
export type CancelPickups = (transaction: Transaction, pickups: PickupCancellation[])
=> void | PickupCancellationOutcome[] | Promise<PickupCancellationOutcome[] | void>;
