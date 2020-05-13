import { LocalizationDefinition, LocalizationPOJO, LocalizedBrandingPOJO } from "../common";
import { FilePath, InlineOrReference, InlineOrReferenceArray, URLString, UUID } from "../types";
import { DeliveryServiceDefinition, DeliveryServicePOJO } from "./delivery-service-pojo";
import { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import { PickupServiceDefinition, PickupServicePOJO } from "./pickups/pickup-service-pojo";


/**
 * A carrier that provides delivery services
 */
export interface CarrierPOJO extends CarrierDefinition {
  deliveryServices: DeliveryServicePOJO[];
  pickupServices?: PickupServicePOJO[];
  localization?: LocalizationPOJO<LocalizedBrandingPOJO>;
  createShipment?: CreateShipment;
  cancelShipments?: CancelShipments;
  rateShipment?: RateShipment;
  trackShipment?: TrackShipment;
  createManifest?: CreateManifest;
  schedulePickup?: SchedulePickup;
  cancelPickups?: CancelPickups;
}


/**
 * A carrier that provides delivery services
 */
export interface CarrierDefinition {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change, even if the carrier name changes.
   */
  id: UUID;

  /**
   * The user-friendly carrier name (e.g. "FedEx", "Australia Post")
   */
  name: string;

  /**
   * A short, user-friendly description of the carrier
   */
  description?: string;

  /**
   * The URL of the carrier's website
   */
  websiteURL: URLString;

  /**
   * The carrier's logo image
   */
  logo: FilePath;

  /**
   * The delivery services that are offered by the carrier
   */
  deliveryServices: InlineOrReferenceArray<DeliveryServiceDefinition>;

  /**
   * The package pickup services that are offered by the carrier
   */
  pickupServices?: InlineOrReferenceArray<PickupServiceDefinition>;

  /**
   * Localizaed values for fields that allow localization
   */
  localization?: InlineOrReference<LocalizationDefinition<{
    name?: string;
    description?: string;
    websiteURL?: URLString;
  }>>;

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
