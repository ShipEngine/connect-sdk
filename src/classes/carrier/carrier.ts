import { Country } from "../../countries";
import { LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { error, ErrorCode } from "../../errors";
import { CarrierPOJO, LabelSpecPOJO, PickupCancellationPOJO, PickupRequestPOJO, RateCriteriaPOJO, TrackingCriteriaPOJO } from "../../pojos/carrier";
import { TransactionPOJO } from "../../pojos/common";
import { UrlString, UUID } from "../../types";
import { Joi } from "../../validation";
import { Logo, Transaction } from "../common";
import { App } from "../common/app";
import { hidePrivateFields } from "../utils";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { LabelConfirmation } from "./labels/label-confirmation";
import { LabelSpec } from "./labels/label-spec";
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, RequestPickup, Track, VoidLabel } from "./methods";
import { Packaging } from "./packaging";
import { PickupService } from "./pickup-service";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationConfirmation } from "./pickups/pickup-cancellation-confirmation";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { RateQuote } from "./rates/rate-quote";
import { TrackingCriteria } from "./tracking/tracking-criteria";
import { getMaxServiceArea } from "./utils";

/**
 * A carrier that provides delivery services
 */
export class Carrier {
  //#region Class Fields

  public static readonly label = "carrier";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    websiteURL: Joi.string().website().required(),
    logo: Joi.object().required(),
    deliveryServices: Joi.array().min(1).items(DeliveryService.schema).required(),
    pickupServices: Joi.array().items(PickupService.schema),
    requestPickup: Joi.function(),
    cancelPickup: Joi.function(),
    createLabel: Joi.function(),
    voidLabel: Joi.function(),
    getRates: Joi.function(),
    getTrackingURL: Joi.function(),
    track: Joi.function(),
    createManifest: Joi.function(),
  });

  //#endregion
  //#region Instance Fields

  /** @internal */
  private readonly _requestPickup: RequestPickup | undefined;

  /** @internal */
  private readonly _cancelPickup: CancelPickup | undefined;

  /** @internal */
  private readonly _createLabel: CreateLabel | undefined;

  /** @internal */
  private readonly _voidLabel: VoidLabel | undefined;

  /** @internal */
  private readonly _getRates: GetRates | undefined;

  /** @internal */
  private readonly _getTrackingURL: GetTrackingURL | undefined;

  /** @internal */
  private readonly _track: Track | undefined;

  /** @internal */
  private readonly _createManifest: CreateManifest | undefined;

  /** @internal */
  private readonly _localization: Localization<LocalizedBrandingPOJO>;

  /** @internal */
  private readonly _app: App;

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
  public readonly logo: Logo;

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
   * The service area that this provider covers.
   * This is the maximum service area of all delivery services offered by the carrier.
   */
  public get serviceArea(): ServiceArea {
    return getMaxServiceArea(this.deliveryServices);
  }

  /**
   * Indicates whether this provider consolidates multiple carrier services.
   * This property is `true` if any of the carrier's delivery services are consolidation services.
   */
  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidationService);
  }

  /**
   * Indicates whether a tracking number is provided.
   * This property is `true` if any of the carrier's delivery services have tracking.
   */
  public get hasTracking(): boolean {
    return this.deliveryServices.some((svc) => svc.hasTracking);
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
   * Indicates whether this service requires a manifest, and if so, what type.
   * This property is `false` if none of the carrier's delivery services require a manifest.
   */
  public get requiresManifest(): false | ManifestType {
    for (let service of this.deliveryServices) {
      if (service.requiresManifest) {
        return service.requiresManifest;
      }
    }
    return false;
  }

  /**
   * The label formats that are offered for this service.
   * This list includes all unique label formats that are offered by all of the carrier's delivery services.
   */
  public get labelFormats(): ReadonlyArray<LabelFormat> {
    let labelFormats = new Set<LabelFormat>();
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
  public get labelSizes(): ReadonlyArray<LabelSize> {
    let labelSizes = new Set<LabelSize>();
    for (let service of this.deliveryServices) {
      for (let labelSize of service.labelSizes) {
        labelSizes.add(labelSize);
      }
    }
    return Object.freeze([...labelSizes]);
  }

  /**
   * All countries that this provider ships to or from.
   * This list includes all unique origin and delivery countries for all of the carrier's delivery services.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * All origin countries that this provider ships from.
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
   * All destination countries that this provider ships to.
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
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  new Logo(pojo.logo);
    this.deliveryServices = pojo.deliveryServices.map((svc) => new DeliveryService(svc, app, this));
    this.pickupServices = pojo.pickupServices
      ? pojo.pickupServices.map((svc) => new PickupService(svc, app, this)) : [];
    this.app = app;
    this._app = app;

    // Store any user-defined methods as private fields.
    // For any methods that aren't implemented, set the corresponding class method to undefined.
    pojo.requestPickup ? (this._requestPickup = pojo.requestPickup) : (this.requestPickup = undefined);
    pojo.cancelPickup ? (this._cancelPickup = pojo.cancelPickup) : (this.cancelPickup = undefined);
    pojo.createLabel ? (this._createLabel = pojo.createLabel) : (this.createLabel = undefined);
    pojo.voidLabel ? (this._voidLabel = pojo.voidLabel) : (this.voidLabel = undefined);
    pojo.getRates ? (this._getRates = pojo.getRates) : (this.getRates = undefined);
    pojo.getTrackingURL ? (this._getTrackingURL = pojo.getTrackingURL) : (this.getTrackingURL = undefined);
    pojo.track ? (this._track = pojo.track) : (this.track = undefined);
    pojo.createManifest ? (this._createManifest = pojo.createManifest) : (this.createManifest = undefined);

    // Hide private fields
    hidePrivateFields(this);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
    this.requestPickup && Object.freeze(this.requestPickup);
    this.cancelPickup && Object.freeze(this.cancelPickup);
    this.createLabel && Object.freeze(this.createLabel);
    this.voidLabel && Object.freeze(this.voidLabel);
    this.getRates && Object.freeze(this.getRates);
    this.getTrackingURL && Object.freeze(this.getTrackingURL);
    this.track && Object.freeze(this.track);
    this.createManifest && Object.freeze(this.createManifest);
  }

  //#region Wrappers around user-defined methdos

  /**
   * Requests a package pickup at a time and place
   */
  public async requestPickup?(transaction: TransactionPOJO, request: PickupRequestPOJO): Promise<PickupConfirmation> {
    let _transaction, _request;

    try {
      _transaction = new Transaction(transaction);
      _request = new PickupRequest(request, this._app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the requestPickup method.", { originalError });
    }

    try {
      let confirmation = await this._requestPickup!(_transaction, _request);
      confirmation.shipments = confirmation.shipments || request.shipments;
      return new PickupConfirmation(confirmation);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in requestPickup method.`, { originalError, transactionID });
    }
  }

  /**
   * Cancels a previously-requested package pickup
   */
  public async cancelPickup?(transaction: TransactionPOJO, cancellation: PickupCancellationPOJO)
  : Promise<PickupCancellationConfirmation> {
    let _transaction, _cancellation;

    try {
      _transaction = new Transaction(transaction);
      _cancellation = new PickupCancellation(cancellation, this._app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the cancelPickup method.", { originalError });
    }

    try {
      let confirmation = await this._cancelPickup!(_transaction, _cancellation);
      confirmation = confirmation || { successful: true };
      return new PickupCancellationConfirmation(confirmation);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in cancelPickup method.`, { originalError, transactionID });
    }
  }

  /**
   * Creates a shipping label
   */
  public async createLabel?(transaction: TransactionPOJO, label: LabelSpecPOJO): Promise<LabelConfirmation> {
    let _transaction, _label;

    try {
      _transaction = new Transaction(transaction);
      _label = new LabelSpec(label, this._app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createLabel method.", { originalError });
    }

    try {
      let confirmation = await this._createLabel!(_transaction, _label);
      return new LabelConfirmation(confirmation);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in createLabel method.`, { originalError, transactionID });
    }
  }

  /**
   * Voids a previously-created shipping label
   */
  public async voidLabel?(transaction: TransactionPOJO): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the voidLabel method.", { originalError });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in voidLabel method.`, { originalError, transactionID });
    }
  }

  /**
   * Gets shipping rates for a shipment
   */
  public async getRates?(transaction: TransactionPOJO, criteria: RateCriteriaPOJO): Promise<RateQuote> {
    let _transaction, _criteria;

    try {
      _transaction = new Transaction(transaction);
      _criteria = new RateCriteria(criteria, this._app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getRates method.", { originalError });
    }

    try {
      let quote = await this._getRates!(_transaction, _criteria);
      return new RateQuote(quote, this._app);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in getRates method.`, { originalError, transactionID });
    }
  }

  /**
   * Returns the web page URL where a customer can track a shipment
   */
  public getTrackingURL?(transaction: TransactionPOJO, criteria: TrackingCriteriaPOJO): URL | undefined {
    let _transaction, _criteria;

    try {
      _transaction = new Transaction(transaction);
      _criteria = new TrackingCriteria(criteria, this._app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getTrackingURL method.", { originalError });
    }

    try {
      let url = this._getTrackingURL!(_transaction, _criteria);
      return url ? new URL(url as UrlString) : undefined;
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in getTrackingURL method.`, { originalError, transactionID });
    }
  }

  /**
   * Returns tracking details for a shipment
   */
  public async track?(transaction: TransactionPOJO): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the track method.", { originalError });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in track method.`, { originalError, transactionID });
    }
  }

  /**
   * Creates a manifest for multiple shipments
   */
  public async createManifest?(transaction: TransactionPOJO): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the createManifest method.", { originalError });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in createManifest method.`, { originalError, transactionID });
    }
  }

  //#endregion
}
