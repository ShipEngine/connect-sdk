import { App, LocalizedBrandingPOJO, Transaction, TransactionPOJO } from "../common";
import { Country, DocumentFormat, DocumentSize, ManifestLocation, ManifestShipment, ServiceArea } from "../enums";
import { error, ErrorCode } from "../errors";
import { hideAndFreeze, Joi, Localization, localize, validate, validateArray, _internal } from "../internal";
import { FilePath, UUID } from "../types";
import { CarrierPOJO } from "./carrier-pojo";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { ManifestConfirmation } from "./manifests/manifest-confirmation";
import { NewManifest } from "./manifests/new-manifest";
import { NewManifestPOJO } from "./manifests/new-manifest-pojo";
import { CancelPickups, CancelShipments, CreateManifest, CreateShipment, RateShipment, SchedulePickup, TrackShipment } from "./methods";
import { Packaging } from "./packaging";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationConfirmation } from "./pickups/pickup-cancellation-confirmation";
import { PickupCancellationPOJO } from "./pickups/pickup-cancellation-pojo";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest } from "./pickups/pickup-request";
import { PickupRequestPOJO } from "./pickups/pickup-request-pojo";
import { PickupService } from "./pickups/pickup-service";
import { Rate } from "./rates/rate";
import { RateCriteria } from "./rates/rate-criteria";
import { RateCriteriaPOJO } from "./rates/rate-criteria-pojo";
import { NewShipment } from "./shipments/new-shipment";
import { NewShipmentPOJO } from "./shipments/new-shipment-pojo";
import { ShipmentCancellation, ShipmentCancellationPOJO } from "./shipments/shipment-cancellation";
import { ShipmentCancellationConfirmation } from "./shipments/shipment-cancellation-confirmation";
import { ShipmentConfirmation } from "./shipments/shipment-confirmation";
import { TrackingCriteria, TrackingCriteriaPOJO } from "./tracking/tracking-criteria";
import { TrackingInfo } from "./tracking/tracking-info";
import { getMaxServiceArea } from "./utils";

const _private = Symbol("private fields");

/**
 * A carrier that provides delivery services
 */
export class Carrier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "carrier",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      websiteURL: Joi.string().website().required(),
      logo: Joi.string().filePath({ ext: ".svg" }).required(),
      manifestLocations: Joi.string().enum(ManifestLocation)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),
      manifestShipments: Joi.string().enum(ManifestShipment)
        .when("createManifest", { is: Joi.function().required(), then: Joi.required() }),
      deliveryServices: Joi.array().min(1).items(DeliveryService[_internal].schema).required(),
      pickupServices: Joi.array().items(PickupService[_internal].schema),
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().min(1).max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
        websiteURL: Joi.string().website(),
      }),
      createShipment: Joi.function(),
      cancelShipments: Joi.function(),
      rateShipment: Joi.function(),
      trackShipment: Joi.function(),
      createManifest: Joi.function(),
      schedulePickup: Joi.function(),
      cancelPickups: Joi.function(),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly app: App;
    readonly localization: Localization<LocalizedBrandingPOJO>;
    readonly createShipment: CreateShipment | undefined;
    readonly cancelShipments: CancelShipments | undefined;
    readonly rateShipment: RateShipment | undefined;
    readonly trackShipment: TrackShipment | undefined;
    readonly createManifest: CreateManifest | undefined;
    readonly schedulePickup: SchedulePickup | undefined;
    readonly cancelPickups: CancelPickups | undefined;
  };

  //#endregion
  //#region Public Fields

  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change, even if the carrier name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly carrier name (e.g. "FedEx", "Australia Post")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the carrier
   */
  public readonly description: string;

  /**
   * The URL of the carrier's website
   */
  public readonly websiteURL: URL;

  /**
   * The carrier's logo image
   */
  public readonly logo: FilePath;

  /**
   * Indicates which locations are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  public readonly manifestLocations?: ManifestLocation;

  /**
   * Indicates which shipments are included in end-of-day manifests.
   * This field is required if the `createManifest` method is implemented.
   */
  public readonly manifestShipments?: ManifestShipment;

  /**
   * The delivery services that are offered by this carrier
   */
  public readonly deliveryServices: ReadonlyArray<DeliveryService>;

  /**
   * The package pickup services that are offered by this carrier
   */
  public readonly pickupServices: ReadonlyArray<PickupService>;

  //#endregion
  //#region Helper Properties

  /**
   * The service area that this carrier covers.
   * This is the maximum service area of all delivery services offered by the carrier.
   */
  public get serviceArea(): ServiceArea {
    return getMaxServiceArea(this.deliveryServices);
  }

  /**
   * Indicates whether this carrier consolidates multiple carrier services.
   * This property is `true` if any of the carrier's delivery services are consolidation services.
   */
  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidationService);
  }

  /**
   * Indicates whether any of the carrier's delivery services are insurable.
   */
  public get hasInsurance(): boolean {
    return this.deliveryServices.some((svc) => svc.isInsurable);
  }

  /**
   * Indicates whether any of the carrier's delivery services are trackable.
   */
  public get hasTracking(): boolean {
    return this.deliveryServices.some((svc) => svc.isTrackable);
  }

  /**
   * Indicates whether the carrier provides a sandbox/development API for any of its delivery
   * or pickup services.
   */
  public get hasSandbox(): boolean {
    let hasSandbox = (svc: { hasSandbox: boolean }) => svc.hasSandbox;
    let found = this.deliveryServices.some(hasSandbox);
    found || (found = this.pickupServices.some(hasSandbox));
    return found;
  }

  /**
   * The label formats that are offered for this service.
   * This list includes all unique label formats that are offered by all of the carrier's delivery services.
   */
  public get labelFormats(): ReadonlyArray<DocumentFormat> {
    let labelFormats = new Set<DocumentFormat>();
    for (let service of this.deliveryServices) {
      for (let labelFormat of service.labelFormats) {
        labelFormats.add(labelFormat);
      }
    }
    return Object.freeze([...labelFormats]);
  }

  /**
   * The label dimensions that are used for this service.
   * This list includes all unique label sizes that are offered by all of the carrier's delivery services.
   */
  public get labelSizes(): ReadonlyArray<DocumentSize> {
    let labelSizes = new Set<DocumentSize>();
    for (let service of this.deliveryServices) {
      for (let labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return Object.freeze([...labelSizes]);
  }

  /**
   * All countries that this carrier ships to or from.
   * This list includes all unique origin and delivery countries for all of the carrier's delivery services.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * All origin countries that this carrier ships from.
   * This list includes all unique origin countries for all of the carrier's delivery services.
   */
  public get originCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.originCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  /**
   * All destination countries that this carrier ships to.
   * This list includes all unique delivery countries for all of the carrier's delivery services.
   */
  public get destinationCountries(): ReadonlyArray<Country> {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.destinationCountries) {
        countries.add(country);
      }
    }
    return Object.freeze([...countries]);
  }

  /**
   * The types of packaging that are provided/allowed for this service.
   * This list includes all unique packaging types for all of the carrier's delivery services.
   */
  public get packaging(): ReadonlyArray<Packaging> {
    let packaging = new Set<Packaging>();
    for (let service of this.deliveryServices) {
      for (let parcel of service.packaging) {
        packaging.add(parcel);
      }
    }
    return Object.freeze([...packaging]);
  }

  /**
   * The types of package delivery confirmations offered for this service.
   * This list includes all unique delivery confirmations for all of the carrier's delivery services.
   */
  public get deliveryConfirmations(): ReadonlyArray<DeliveryConfirmation> {
    let deliveryConfirmations = new Set<DeliveryConfirmation>();
    for (let service of this.deliveryServices) {
      for (let deliveryConfirmation of service.deliveryConfirmations) {
        deliveryConfirmations.add(deliveryConfirmation);
      }
    }
    return Object.freeze([...deliveryConfirmations]);
  }

  //#endregion

  public constructor(pojo: CarrierPOJO, app: App) {
    this.id = pojo.id;
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  pojo.logo;
    this.manifestLocations = pojo.manifestLocations;
    this.manifestShipments = pojo.manifestShipments;
    this.deliveryServices = pojo.deliveryServices.map((svc) => new DeliveryService(svc, app));
    this.pickupServices = pojo.pickupServices
      ? pojo.pickupServices.map((svc) => new PickupService(svc, app)) : [];

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),

      // Store any user-defined methods as private fields.
      // For any methods that aren't implemented, set the corresponding class method to undefined.
      createShipment: pojo.createShipment ? pojo.createShipment : (this.createShipment = undefined),
      cancelShipments: pojo.cancelShipments ? pojo.cancelShipments : (this.cancelShipments = undefined),
      rateShipment: pojo.rateShipment ? pojo.rateShipment : (this.rateShipment = undefined),
      trackShipment: pojo.trackShipment ? pojo.trackShipment : (this.trackShipment = undefined),
      createManifest: pojo.createManifest ? pojo.createManifest : (this.createManifest = undefined),
      schedulePickup: pojo.schedulePickup ? pojo.schedulePickup : (this.schedulePickup = undefined),
      cancelPickups: pojo.cancelPickups ? pojo.cancelPickups : (this.cancelPickups = undefined),
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  /**
   * Creates a copy of the carrier, localized for the specified locale if possible.
   */
  public localize(locale: string): Carrier {
    let pojo = localize(this, locale);
    return new Carrier(pojo, this[_private].app);
  }

  /**
   * Returns the carrier as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): CarrierPOJO {
    let { localization } = this[_private];
    let methods = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      websiteURL: this.websiteURL.href,
      deliveryServices: this.deliveryServices.map((o) => o.toJSON(locale)),
      pickupServices: this.pickupServices.map((o) => o.toJSON(locale)),
      createShipment: methods.createShipment,
      cancelShipments: methods.cancelShipments,
      rateShipment: methods.rateShipment,
      trackShipment: methods.trackShipment,
      createManifest: methods.createManifest,
      schedulePickup: methods.schedulePickup,
      cancelPickups: methods.cancelPickups,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }

  //#region Wrappers around user-defined methdos

  /**
   * Creates a new shipment, including its labels, tracking numbers, customs forms, etc.
   */
  public async createShipment?(transaction: TransactionPOJO, shipment: NewShipmentPOJO): Promise<ShipmentConfirmation> {
    let _transaction, _shipment;
    let { app, createShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new NewShipment(validate(shipment, NewShipment), app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createShipment method.", { originalError });
    }

    try {
      let confirmation = await createShipment!(_transaction, _shipment);
      return new ShipmentConfirmation(validate(confirmation, ShipmentConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in createShipment method.`, { originalError, transactionID });
    }
  }

  /**
   * Cancels one or more shipments that were previously created. Depending on the carrier,
   * this may include voiding labels, refunding charges, and/or removing the shipment from the day's manifest.
   */
  public async cancelShipments?(transaction: TransactionPOJO, shipments: ShipmentCancellationPOJO[]): Promise<unknown> {
    let _transaction, _shipments;
    let { app, cancelShipments } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipments = validateArray(shipments, ShipmentCancellation).map((shipment) => new ShipmentCancellation(shipment));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the cancelShipments method.", { originalError });
    }

    try {
      let confirmations = await cancelShipments!(_transaction, _shipments);

      if (!confirmations) {
        // Nothing was returned, so assume all shipments were canceled successfully
        confirmations = _shipments.map((shipment) => ({
          shipmentID: shipment.shipmentID,
          successful: true,
        }));
      }

      return validateArray(confirmations, ShipmentCancellationConfirmation)
        .map((confirmation) => new ShipmentCancellationConfirmation(confirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in cancelShipments method.`, { originalError, transactionID });
    }
  }

  /**
   * Calculates the shipping costs for a shipment, or multiple permutations of a shipment
   */
  public async rateShipment?(transaction: TransactionPOJO, shipment: RateCriteriaPOJO): Promise<Rate[]> {
    let _transaction, _shipment;
    let { app, rateShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new RateCriteria(validate(shipment, RateCriteria), app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the rateShipment method.", { originalError });
    }

    try {
      let rates = await rateShipment!(_transaction, _shipment);
      return validateArray(rates, Rate).map((rate) => new Rate(rate, app));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in rateShipment method.`, { originalError, transactionID });
    }
  }

  /**
   * Returns tracking details for a shipment
   */
  public async trackShipment?(transaction: TransactionPOJO, shipment: TrackingCriteriaPOJO): Promise<TrackingInfo> {
    let _transaction, _shipment;
    let { app, trackShipment } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new TrackingCriteria(validate(shipment, TrackingCriteria));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the trackShipment method.", { originalError });
    }

    try {
      let trackingInfo = await trackShipment!(_transaction, _shipment);
      return new TrackingInfo(validate(trackingInfo, TrackingInfo), app);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in trackShipment method.`, { originalError, transactionID });
    }
  }

  /**
   * Creates an end-of-day manifest
   */
  public async createManifest?(transaction: TransactionPOJO, manifest: NewManifestPOJO): Promise<ManifestConfirmation> {
    let _transaction, _manifest;
    let { createManifest } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _manifest = new NewManifest(validate(manifest, NewManifest), this);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createManifest method.", { originalError });
    }

    try {
      let confirmation = await createManifest!(_transaction, _manifest);
      return new ManifestConfirmation(validate(confirmation, ManifestConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in createManifest method.`, { originalError, transactionID });
    }
  }

  /**
   * Schedules a package pickup at a time and place
   */
  public async schedulePickup?(transaction: TransactionPOJO, request: PickupRequestPOJO): Promise<PickupConfirmation> {
    let _transaction, _request;
    let { app, schedulePickup } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _request = new PickupRequest(validate(request, PickupRequest), app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the schedulePickup method.", { originalError });
    }

    try {
      let confirmation = await schedulePickup!(_transaction, _request);

      if (confirmation && confirmation.shipments === undefined) {
        // By default, all shipments will be picked up
        confirmation.shipments = request.shipments;
      }

      return new PickupConfirmation(validate(confirmation, PickupConfirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in schedulePickup method.`, { originalError, transactionID });
    }
  }

  /**
   * Cancels one or more previously-requested package pickups
   */
  public async cancelPickups?(transaction: TransactionPOJO, pickups: PickupCancellationPOJO[])
  : Promise<PickupCancellationConfirmation[]> {
    let _transaction, _pickups;
    let { app, cancelPickups } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _pickups = validateArray(pickups, PickupCancellation)
        .map((pickup) => new PickupCancellation(pickup, app));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the cancelPickups method.", { originalError });
    }

    try {
      let confirmations = await cancelPickups!(_transaction, _pickups);

      if (!confirmations) {
        // Nothing was returned, so assume all pickups were canceled successfully
        confirmations = _pickups.map((pickup) => ({
          pickupID: pickup.pickupID,
          successful: true,
        }));
      }

      return validateArray(confirmations, PickupCancellationConfirmation)
        .map((confirmation) => new PickupCancellationConfirmation(confirmation));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in cancelPickups method.`, { originalError, transactionID });
    }
  }

  //#endregion
}

// Prevent modifications to the class
hideAndFreeze(Carrier);
