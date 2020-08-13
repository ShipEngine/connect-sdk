import type { ConnectionAppDefinition, InlineOrReference, InlineOrReferenceArray } from "../common";
import type { DeliveryServiceDefinition } from "./delivery-service";
import type { ManifestLocation, ManifestShipment, ManifestType } from "./enums";
import type { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import type { PickupServiceDefinition } from "./pickups/pickup-service";

/**
 * A ShipEngine Connect carrier app
 */
export interface CarrierAppDefinition extends ConnectionAppDefinition {
  /**
   * Indicates which locations are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  manifestLocations?: ManifestLocation;

  /**
   * Indicates which shipments are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  manifestShipments?: ManifestShipment;

  /**
   * Indicates what type of manifests the carrier supports
   */
  manifestType?: ManifestType;


  /**
   * Tracking url format for the carrier.
   */
  trackingURLTemplate?: string;

  /**
   * The delivery services that are offered by the carrier
   */
  deliveryServices: InlineOrReferenceArray<DeliveryServiceDefinition>;

  /**
   * The package pickup services that are offered by the carrier
   */
  pickupServices?: InlineOrReferenceArray<PickupServiceDefinition>;

  /**
   * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
   */
  createShipment?: InlineOrReference<CreateShipment>;

  /**
   * Cancels one or more shipments that were previously created. Depending on the carrier,
   * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
   */
  cancelShipments?: InlineOrReference<CancelShipments>;

  /**
   * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
   */
  rateShipment?: InlineOrReference<RateShipment>;

  /**
   * Returns tracking details for a shipment
   */
  trackShipment?: InlineOrReference<TrackShipment>;

  /**
   * Creates an end-of-day manifest
   */
  createManifest?: InlineOrReference<CreateManifest>;

  /**
   * Schedules a package pickup at a time and place
   */
  schedulePickup?: InlineOrReference<SchedulePickup>;

  /**
   * Cancels one or more previously-requested package pickups
   */
  cancelPickups?: InlineOrReference<CancelPickups>;
}
