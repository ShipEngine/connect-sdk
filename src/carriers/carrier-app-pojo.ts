import { Connect, FormPOJO, InlineOrReference, InlineOrReferenceArray, LocalizationPOJO, LocalizedBrandingPOJO } from "../common";
import { AppPOJO, ConnectionAppDefinition } from "../common/internal";
import { DeliveryServiceDefinition, DeliveryServicePOJO } from "./delivery-service-pojo";
import { ManifestLocation, ManifestShipment } from "./manifests/enums";
import { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import { PickupServiceDefinition, PickupServicePOJO } from "./pickups/pickup-service-pojo";


/**
 * A ShipEngine Integration Platform carrier app
 */
export interface CarrierAppPOJO extends CarrierAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  deliveryServices: ReadonlyArray<DeliveryServicePOJO>;
  pickupServices?: ReadonlyArray<PickupServicePOJO>;
  connect: Connect;
  createShipment?: CreateShipment;
  cancelShipments?: CancelShipments;
  rateShipment?: RateShipment;
  trackShipment?: TrackShipment;
  createManifest?: CreateManifest;
  schedulePickup?: SchedulePickup;
  cancelPickups?: CancelPickups;
}


/**
 * A ShipEngine Integration Platform carrier app
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
