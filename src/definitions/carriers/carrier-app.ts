import type { AppType, ConnectionApp, ConnectionAppDefinition, Country, InlineOrReference, InlineOrReferenceArray, Transaction } from "../common";
import type { DeliveryConfirmation } from "./delivery-confirmation";
import type { DeliveryService } from "./delivery-service";
import type { DocumentFormat, DocumentSize, ManifestLocation, ManifestShipment, ManifestType, ServiceArea } from "./enums";
import type { ManifestConfirmation } from "./manifests/manifest-confirmation";
import type { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import type { Packaging } from "./packaging";
import type { PickupCancellationOutcome } from "./pickups/pickup-cancellation-outcome";
import type { PickupConfirmation } from "./pickups/pickup-confirmation";
import type { PickupService } from "./pickups/pickup-service";
import type { Rate } from "./rates/rate";
import { ShipmentCancellationOutcome } from "./shipments/shipment-cancellation-outcome";
import type { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import type { TrackingInfo } from "./tracking/tracking-info";
import { TrackingCriteria } from "./tracking/tracking-criteria";
import { RateCriteria } from "./rates/rate-criteria";
import { ShipmentCancellation } from "./shipments/shipment-cancellation";
import { NewShipment } from "./shipments/new-shipment";
import { NewManifest } from "./manifests/new-manifest";
import { PickupRequest } from "./pickups/pickup-request";
import { PickupCancellation } from "./pickups/pickup-cancellation";

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
   * Indicates what type of manifests the carrier supports
   */
  manifestType: ManifestType;

  /**
   * The delivery services that are offered by the carrier
   */
  deliveryServices: InlineOrReferenceArray<DeliveryService>;

  /**
   * The package pickup services that are offered by the carrier
   */
  pickupServices?: InlineOrReferenceArray<PickupService>;

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

/**
 * A ShipEngine Integration Platform carrier app
 */
export interface CarrierApp extends ConnectionApp {
  /**
   * Indicates that this is a carrier app
   */
  type: AppType;

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
  manifestType: ManifestType;

  /**
   * The delivery services that are offered by this carrier
   */
  deliveryServices: Array<DeliveryService>;

  /**
   * The package pickup services that are offered by this carrier
   */
  pickupServices: Array<PickupService>;

  /**
   * The service area that this carrier covers.
   * This is the maximum service area of all delivery services offered by the carrier.
   */
  serviceArea: ServiceArea;

  /**
   * Indicates whether this carrier consolidates multiple carrier services.
   * This property is `true` if any of the carrier's delivery services are consolidation services.
   */
  isConsolidator: boolean;

  /**
   * Indicates whether any of the carrier's delivery services are insurable.
   */
  hasInsurance: boolean;

  /**
   * Indicates whether any of the carrier's delivery services are trackable.
   */
  hasTracking: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for any of its delivery
   * or pickup services.
   */
  hasSandbox: boolean;

  /**
   * The label formats that are used by this carrier.
   * This list includes all unique label formats that are offered by all of the carrier's delivery services.
   */
  labelFormats: Array<DocumentFormat>;

  /**
   * The label dimensions that are used by this carrier.
   * This list includes all unique label sizes that are offered by all of the carrier's delivery services.
   */
  labelSizes: Array<DocumentSize>;

  /**
   * All countries that this carrier ships to or from.
   * This list includes all unique origin and delivery countries for all of the carrier's delivery services.
   */
  countries: Array<Country>;

  /**
   * All origin countries that this carrier ships from.
   * This list includes all unique origin countries for all of the carrier's delivery services.
   */
  originCountries: Array<Country>;

  /**
   * All destination countries that this carrier ships to.
   * This list includes all unique delivery countries for all of the carrier's delivery services.
   */
  destinationCountries: Array<Country>;

  /**
   * The types of packaging that are provided/allowed for this carrier.
   * This list includes all unique packaging types for all of the carrier's delivery services.
   */
  packaging: Array<Packaging>;

  /**
   * The types of package delivery confirmations offered for this carrier.
   * This list includes all unique delivery confirmations for all of the carrier's delivery services.
   */
  deliveryConfirmations: Array<DeliveryConfirmation>;

  /**
   * Indicates if any of the delivery services in the carrier app support return shipments.
   */
  supportsReturns: boolean;

  /**
   * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
   */
  createShipment?(transaction: Transaction, shipment: NewShipment): Promise<ShipmentConfirmation>;

  /**
   * Cancels one or more shipments that were previously created. Depending on the carrier,
   * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
   */
  cancelShipments?(
    transaction: Transaction, shipments: ShipmentCancellation[]): Promise<ShipmentCancellationOutcome[]>;

  /**
   * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
   */
  rateShipment?(transaction: Transaction, shipment: RateCriteria): Promise<Rate[]>;

  /**
   * Returns tracking details for a shipment
   */
  trackShipment?(transaction: Transaction, shipment: TrackingCriteria): Promise<TrackingInfo>;

  /**
   * Creates an end-of-day manifest
   */
  createManifest?(transaction: Transaction, manifest: NewManifest): Promise<ManifestConfirmation>;

  /**
   * Schedules a package pickup at a time and place
   */
  schedulePickup?(transaction: Transaction, pickup: PickupRequest): Promise<PickupConfirmation>;

  /**
   * Cancels one or more previously-requested package pickups
   */
  cancelPickups?(
    transaction: Transaction, pickups: PickupCancellation[]): Promise<PickupCancellationOutcome[]>;
}
