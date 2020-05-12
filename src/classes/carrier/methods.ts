import { ManifestConfirmationPOJO, PickupCancellationConfirmationPOJO, PickupConfirmationPOJO, RatePOJO, ShipmentCancellationConfirmationPOJO, ShipmentConfirmationPOJO } from "../../pojos/carrier";
import { TrackingInfoPOJO } from "../../pojos/carrier/tracking-info-pojo";
import { Transaction } from "../common";
import { NewManifest } from "./manifests/new-manifest";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { NewShipment } from "./shipments/new-shipment";
import { ShipmentCancellation } from "./shipments/shipment-cancellation";
import { TrackingCriteria } from "./tracking/tracking-criteria";

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
export type Track = (transaction: Transaction, shipment: TrackingCriteria) => TrackingInfoPOJO | Promise<TrackingInfoPOJO>;

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
