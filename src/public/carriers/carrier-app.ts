import type { AppPOJO, AppType, Connect, ConnectionApp, ConnectionAppDefinition, Country, FormPOJO, InlineOrReference, InlineOrReferenceArray, LocalizationPOJO, LocalizedBrandingPOJO, TransactionPOJO } from "../common";
import type { DeliveryConfirmation } from "./delivery-confirmation";
import type { DeliveryService, DeliveryServiceDefinition, DeliveryServicePOJO } from "./delivery-service";
import type { DocumentFormat, DocumentSize, ManifestLocation, ManifestShipment, ServiceArea } from "./enums";
import type { ManifestConfirmation } from "./manifests/manifest-confirmation";
import type { NewManifestPOJO } from "./manifests/new-manifest";
import type { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import type { Packaging } from "./packaging";
import type { PickupCancellationPOJO } from "./pickups/pickup-cancellation";
import type { PickupCancellationOutcome } from "./pickups/pickup-cancellation-outcome";
import type { PickupConfirmation } from "./pickups/pickup-confirmation";
import type { PickupRequestPOJO } from "./pickups/pickup-request";
import type { PickupService, PickupServiceDefinition, PickupServicePOJO } from "./pickups/pickup-service";
import type { Rate } from "./rates/rate";
import type { RateCriteriaPOJO } from "./rates/rate-criteria";
import type { NewShipmentPOJO } from "./shipments/new-shipment";
import type { ShipmentCancellationPOJO } from "./shipments/shipment-cancellation";
import type { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import type { TrackingCriteriaPOJO } from "./tracking/tracking-criteria";
import type { TrackingInfo } from "./tracking/tracking-info";


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
export interface CarrierApp extends ConnectionApp {
  /**
   * Indicates that this is a carrier app
   */
  readonly type: AppType;

  /**
   * Indicates which locations are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  readonly manifestLocations?: ManifestLocation;

  /**
   * Indicates which shipments are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  readonly manifestShipments?: ManifestShipment;

  /**
   * The delivery services that are offered by this carrier
   */
  readonly deliveryServices: ReadonlyArray<DeliveryService>;

  /**
   * The package pickup services that are offered by this carrier
   */
  readonly pickupServices: ReadonlyArray<PickupService>;

  /**
   * The service area that this carrier covers.
   * This is the maximum service area of all delivery services offered by the carrier.
   */
  readonly serviceArea: ServiceArea;

  /**
   * Indicates whether this carrier consolidates multiple carrier services.
   * This property is `true` if any of the carrier's delivery services are consolidation services.
   */
  readonly isConsolidator: boolean;

  /**
   * Indicates whether any of the carrier's delivery services are insurable.
   */
  readonly hasInsurance: boolean;

  /**
   * Indicates whether any of the carrier's delivery services are trackable.
   */
  readonly hasTracking: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for any of its delivery
   * or pickup services.
   */
  readonly hasSandbox: boolean;

  /**
   * The label formats that are offered for this service.
   * This list includes all unique label formats that are offered by all of the carrier's delivery services.
   */
  readonly labelFormats: ReadonlyArray<DocumentFormat>;

  /**
   * The label dimensions that are used for this service.
   * This list includes all unique label sizes that are offered by all of the carrier's delivery services.
   */
  readonly labelSizes: ReadonlyArray<DocumentSize>;

  /**
   * All countries that this carrier ships to or from.
   * This list includes all unique origin and delivery countries for all of the carrier's delivery services.
   */
  readonly countries: ReadonlyArray<Country>;

  /**
   * All origin countries that this carrier ships from.
   * This list includes all unique origin countries for all of the carrier's delivery services.
   */
  readonly originCountries: ReadonlyArray<Country>;

  /**
   * All destination countries that this carrier ships to.
   * This list includes all unique delivery countries for all of the carrier's delivery services.
   */
  readonly destinationCountries: ReadonlyArray<Country>;

  /**
   * The types of packaging that are provided/allowed for this service.
   * This list includes all unique packaging types for all of the carrier's delivery services.
   */
  readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The types of package delivery confirmations offered for this service.
   * This list includes all unique delivery confirmations for all of the carrier's delivery services.
   */
  readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  /**
   * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
   */
  createShipment?(transaction: TransactionPOJO, shipment: NewShipmentPOJO): Promise<ShipmentConfirmation>;

  /**
   * Cancels one or more shipments that were previously created. Depending on the carrier,
   * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
   */
  cancelShipments?(transaction: TransactionPOJO, shipments: ShipmentCancellationPOJO[]): Promise<unknown>;

  /**
   * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
   */
  rateShipment?(transaction: TransactionPOJO, shipment: RateCriteriaPOJO): Promise<Rate[]>;

  /**
   * Returns tracking details for a shipment
   */
  trackShipment?(transaction: TransactionPOJO, shipment: TrackingCriteriaPOJO): Promise<TrackingInfo>;

  /**
   * Creates an end-of-day manifest
   */
  createManifest?(transaction: TransactionPOJO, manifest: NewManifestPOJO): Promise<ManifestConfirmation>;

  /**
   * Schedules a package pickup at a time and place
   */
  schedulePickup?(transaction: TransactionPOJO, pickup: PickupRequestPOJO): Promise<PickupConfirmation>;

  /**
   * Cancels one or more previously-requested package pickups
   */
  cancelPickups?(
    transaction: TransactionPOJO, pickups: PickupCancellationPOJO[]): Promise<PickupCancellationOutcome[]>;
}
