import { ono } from "@jsdevtools/ono";
import { App } from "../app";
import { AppManifest } from "../app-manifest";
import { assert } from "../assert";
import { DeliveryServiceConfig, FormConfig, LabelSpecConfig, LogoConfig, PickupCancellationConfig, PickupRequestConfig, PickupServiceConfig, RateCriteriaConfig, ShippingProviderConfig, TransactionConfig } from "../config";
import { Country } from "../countries";
import { ServiceArea } from "../enums";
import { ErrorCode } from "../errors";
import { Form } from "../form";
import { Transaction } from "../transaction";
import { UUID } from "../types";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { LabelConfirmation } from "./labels/label-confirmation";
import { LabelSpec } from "./labels/label-spec";
import { Logo } from "./logo";
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingUrl, Login, RequestPickup, Track, VoidLabel } from "./methods";
import { Packaging } from "./packaging";
import { PickupService } from "./pickup-service";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationConfirmation } from "./pickups/pickup-cancellation-confirmation";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest } from "./pickups/pickup-request";
import { RateCriteria } from "./rates/rate-criteria";
import { RateQuote } from "./rates/rate-quote";

/**
 * A ShipEngine IPaaS shipping provider app.
 */
export class ShippingProviderApp extends App {
  //#region Fields

  // Store the user-defined methods as private fields.
  // We wrap these methods with our own signatures below
  private readonly _login: Login | undefined;
  private readonly _requestPickup: RequestPickup | undefined;
  private readonly _cancelPickup: CancelPickup | undefined;
  private readonly _createLabel: CreateLabel | undefined;
  private readonly _voidLabel: VoidLabel | undefined;
  private readonly _getRates: GetRates | undefined;
  private readonly _getTrackingUrl: GetTrackingUrl | undefined;
  private readonly _track: Track | undefined;
  private readonly _createManifest: CreateManifest | undefined;

  /**
   * A UUID that uniquely identifies the shipping provider.
   * This ID should never change, even if the provider name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly provider name (e.g. "Stamps.com", "FirstMile")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the shipping provider
   */
  public readonly description: string;

  /**
   * The URL of the provider's website
   */
  public readonly websiteURL: URL;

  /**
   * The shipping provider's logo image
   */
  public readonly logo: Logo;

  /**
   * The delivery services that are offered
   */
  public readonly deliveryServices: ReadonlyArray<DeliveryService>;

  /**
   * The package pickup services that are offered
   */
  public readonly pickupServices: ReadonlyArray<PickupService>;

  /**
   * A form that allows the user to enter their login credentials
   */
  public readonly loginForm: Form;

  /**
   * A form that allows the user to configure settings
   */
  public readonly settingsForm: Form | undefined;

  //#endregion

  //#region Helper properties

  /**
   * All countries that this provider ships to or from
   */
  public get countries(): Country[] {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return [...countries];
  }

  /**
   * All origin countries that this provider ships from
   */
  public get originCountries(): Country[] {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.originCountries) {
        countries.add(country);
      }
    }
    return [...countries];
  }

  /**
   * All destination countries that this provider ships to
   */
  public get destinationCountries(): Country[] {
    let countries = new Set<Country>();
    for (let service of this.deliveryServices) {
      for (let country of service.destinationCountries) {
        countries.add(country);
      }
    }
    return [...countries];
  }

  /**
   * The service area that this provider covers
   */
  public get serviceArea(): ServiceArea {
    let maxArea = ServiceArea.Regional;

    // Find the broadest service area supported by this provider
    for (let service of this.deliveryServices) {
      if (service.serviceArea === ServiceArea.Worldwide) {
        // This is the widest possible service area, so no need to continue crawling.
        return ServiceArea.Worldwide;
      }
      else if (service.serviceArea === ServiceArea.Domestic) {
        // Replace "regional" with "domestic"
        maxArea = ServiceArea.Domestic;
      }
    }

    return maxArea;
  }

  /**
   * Indicates whether this provider consolidates multiple carrier services
   */
  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidator);
  }

  //#endregion

  /**
   * Creates a ShipEngine IPaaS shipping provider app from a fully-resolved config object
   */
  public constructor(manifest: AppManifest, config: ShippingProviderConfig) {
    super(manifest);
    assert.type.object(config, "ShipEngine IPaaS app");
    this.id = assert.string.uuid(config.id, "provider ID");
    this.name = assert.string.nonWhitespace(config.name, "shipping provider name");
    this.description = assert.string(config.description, "shipping provider description", "");
    this.websiteURL = new URL(assert.string.nonWhitespace(config.websiteURL, "websiteURL"));
    this.logo = new Logo(config.logo as LogoConfig);
    this.deliveryServices = assert.array.nonEmpty(config.deliveryServices, "deliveryServices")
      .map((svc: DeliveryServiceConfig) => new DeliveryService(svc));
    this.pickupServices = assert.array(config.pickupServices, "pickupServices", [])
      .map((svc: PickupServiceConfig) => new PickupService(svc));
    this.loginForm = new Form(config.loginForm as FormConfig);
    this.settingsForm = config.settingsForm ? new Form(config.settingsForm as FormConfig) : undefined;

    // Store any user-defined methods as private fields.
    // For any methods that aren't implemented, set the corresponding class method to undefined.
    config.login
      ? (this._login = assert.type.function(config.login as Login, "login method"))
      : (this.login = undefined);

    config.requestPickup
      ? (this._requestPickup = assert.type.function(config.requestPickup as RequestPickup, "requestPickup method"))
      : (this.requestPickup = undefined);

    config.cancelPickup
      ? (this._cancelPickup = assert.type.function(config.cancelPickup as CancelPickup, "cancelPickup method"))
      : (this.cancelPickup = undefined);

    config.createLabel
      ? (this._createLabel = assert.type.function(config.createLabel as CreateLabel, "createLabel method"))
      : (this.createLabel = undefined);

    config.voidLabel
      ? (this._voidLabel = assert.type.function(config.voidLabel as VoidLabel, "voidLabel method"))
      : (this.voidLabel = undefined);

    config.getRates
      ? (this._getRates = assert.type.function(config.getRates as GetRates, "getRates method"))
      : (this.getRates = undefined);

    config.getTrackingUrl
      ? (this._getTrackingUrl = assert.type.function(config.getTrackingUrl as GetTrackingUrl, "getTrackingUrl method"))
      : (this.getTrackingUrl = undefined);

    config.track
      ? (this._track = assert.type.function(config.track as Track, "track method"))
      : (this.track = undefined);

    config.createManifest
      ? (this._createManifest = assert.type.function(config.createManifest as CreateManifest, "createManifest method"))
      : (this.createManifest = undefined);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
    Object.freeze(this.deliveryServices);
    Object.freeze(this.pickupServices);
  }

  //#region Wrappers around user-defined methdos

  /**
   * Verifies a user's credentials and establishes or renews a session
   *
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async login?(transaction: TransactionConfig): Promise<void> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      await this._login!(_transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in login method.`);
    }
  }

  /**
   * Requests a package pickup at a time and place
   */
  public async requestPickup?(transaction: TransactionConfig, request: PickupRequestConfig)
  : Promise<PickupConfirmation> {
    let _transaction, _request;

    try {
      _transaction = new Transaction(transaction);
      _request = new PickupRequest(this, request);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      let confirmation = await this._requestPickup!(_transaction, _request);
      confirmation.shipments = confirmation.shipments || request.shipments;
      return new PickupConfirmation(confirmation);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in requestPickup method.`);
    }
  }

  /**
   * Cancels a previously-requested package pickup
   */
  public async cancelPickup?(transaction: TransactionConfig, cancellation: PickupCancellationConfig)
  : Promise<PickupCancellationConfirmation> {
    let _transaction, _cancellation;

    try {
      _transaction = new Transaction(transaction);
      _cancellation = new PickupCancellation(this, cancellation);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      let confirmation = await this._cancelPickup!(_transaction, _cancellation);
      confirmation = confirmation || { successful: true };
      return new PickupCancellationConfirmation(confirmation);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in cancelPickup method.`);
    }
  }

  /**
   * Creates a shipping label
   */
  public async createLabel?(transaction: TransactionConfig, label: LabelSpecConfig): Promise<LabelConfirmation> {
    let _transaction, _label;

    try {
      _transaction = new Transaction(transaction);
      _label = new LabelSpec(this, label);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      let confirmation = await this._createLabel!(_transaction, _label);
      return new LabelConfirmation(confirmation);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in createLabel method.`);
    }
  }

  /**
   * Voids a previously-created shipping label
   */
  public async voidLabel?(transaction: TransactionConfig): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in voidLabel method.`);
    }
  }

  /**
   * Gets shipping rates for a shipment
   */
  public async getRates?(transaction: TransactionConfig, criteria: RateCriteriaConfig): Promise<RateQuote> {
    let _transaction, _criteria;

    try {
      _transaction = new Transaction(transaction);
      _criteria = new RateCriteria(this, criteria);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      let quote = await this._getRates!(_transaction, _criteria);
      return new RateQuote(this, quote);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in getRates method.`);
    }
  }

  /**
   * Returns the web page URL where a customer can track a shipment
   */
  public async getTrackingUrl?(transaction: TransactionConfig): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in getTrackingUrl method.`);
    }
  }

  /**
   * Returns tracking details for a shipment
   */
  public async track?(transaction: TransactionConfig): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in track method.`);
    }
  }

  /**
   * Creates a manifest for multiple shipments
   */
  public async createManifest?(transaction: TransactionConfig): Promise<unknown> {
    let _transaction;

    try {
      _transaction = new Transaction(transaction);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      // TODO: NOT IMPLEMENTED YET
      return await Promise.resolve(undefined);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in createManifest method.`);
    }
  }

  //#endregion

  //#region Helper methods

  /**
   * Returns the pickup service with the specified ID
   */
  public getPickupService(id: UUID): PickupService {
    for (let service of this.pickupServices) {
      if (service.id === id) {
        return service;
      }
    }
    throw new ReferenceError(`Unable to find pickup service "${id}" in the ${this.name} app.`);
  }

  /**
   * Returns the delivery service with the specified ID
   */
  public getDeliveryService(id: UUID): DeliveryService {
    for (let service of this.deliveryServices) {
      if (service.id === id) {
        return service;
      }
    }
    throw new ReferenceError(`Unable to find delivery service "${id}" in the ${this.name} app.`);
  }

  /**
   * Returns the packaging with the specified ID
   */
  public getPackaging(id: UUID): Packaging {
    for (let service of this.deliveryServices) {
      for (let packaging of service.packaging) {
        if (packaging.id === id) {
          return packaging;
        }
      }
    }
    throw new ReferenceError(`Unable to find packaging "${id}" in the ${this.name} app.`);
  }

  /**
   * Returns the delivery confirmation with the specified ID
   */
  public getDeliveryConfirmation(id: UUID): DeliveryConfirmation {
    for (let service of this.deliveryServices) {
      for (let confirmation of service.deliveryConfirmations) {
        if (confirmation.id === id) {
          return confirmation;
        }
      }
    }
    throw new ReferenceError(`Unable to find delivery confirmation "${id}" in the ${this.name} app.`);
  }

  //#endregion
}
