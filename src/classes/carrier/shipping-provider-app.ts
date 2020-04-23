import { ono } from "@jsdevtools/ono";
import { assert } from "../../assert";
import { Country } from "../../countries";
import { ServiceArea } from "../../enums";
import { ErrorCode } from "../../errors";
import { AppManifestPOJO, LabelSpecPOJO, PickupCancellationPOJO, PickupRequestPOJO, RateCriteriaPOJO, ShippingProviderPOJO, TrackingCriteriaPOJO, TransactionPOJO } from "../../pojos";
import { UrlString, UUID } from "../../types";
import { App } from "../app";
import { Form } from "../form";
import { Transaction } from "../transaction";
import { Carrier } from "./carrier";
import { DeliveryService } from "./delivery-service";
import { LabelConfirmation } from "./labels/label-confirmation";
import { LabelSpec } from "./labels/label-spec";
import { Logo } from "./logo";
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingURL, Login, RequestPickup, Track, VoidLabel } from "./methods";
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
  private readonly _getTrackingURL: GetTrackingURL | undefined;
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
   * A form that allows the user to enter their login credentials
   */
  public readonly loginForm: Form;

  /**
   * A form that allows the user to configure settings
   */
  public readonly settingsForm: Form | undefined;

  /**
   * The carriers that this provider provides services for
   */
  public readonly carriers: ReadonlyArray<Carrier>;

  //#endregion

  //#region Helper Properties

  /**
   * The service area that this provider covers.
   * This is the maximum service area of all delivery services offered by the provider.
   */
  public get serviceArea(): ServiceArea {
    return getMaxServiceArea(this.deliveryServices);
  }

  /**
   * Indicates whether this provider consolidates multiple carrier services.
   * This property is `true` if any of the provider's delivery services are consolidation services.
   */
  public get isConsolidator(): boolean {
    return this.deliveryServices.some((svc) => svc.isConsolidator);
  }

  /**
   * All delivery services that are offered by this provider.
   * This list includes all unique delivery services that are offered by all of this provider's carriers.
   */
  public get deliveryServices(): ReadonlyArray<DeliveryService> {
    let services = new Set<DeliveryService>();
    for (let carrier of this.carriers) {
      for (let service of carrier.deliveryServices) {
        services.add(service);
      }
    }
    return Object.freeze([...services]);
  }

  /**
   * All package pickup services that are offered.
   * This list includes all unique pickup services that are offered by all of this provider's carriers.
   */
  public get pickupServices(): ReadonlyArray<PickupService> {
    let services = new Set<PickupService>();
    for (let carrier of this.carriers) {
      for (let service of carrier.pickupServices) {
        services.add(service);
      }
    }
    return Object.freeze([...services]);
  }

  /**
   * All countries that this provider ships to or from.
   * This list includes all unique origin and delivery countries for all of the provider's carriers.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * All origin countries that this provider ships from.
   * This list includes all unique origin countries for all of the provider's carriers.
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
   * This list includes all unique destination countries for all of the provider's carriers.
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

  //#endregion

  public constructor(manifest: AppManifestPOJO, pojo: ShippingProviderPOJO) {
    super(manifest);

    this.id = this._references.add(this, pojo, "shipping provider");
    this.name = assert.string.nonWhitespace(pojo.name, "shipping provider name");
    this.description = assert.string(pojo.description, "shipping provider description", "");
    this.websiteURL = new URL(assert.string.nonWhitespace(pojo.websiteURL, "websiteURL"));
    this.logo = new Logo(pojo.logo);
    this.loginForm = new Form(pojo.loginForm);
    this.settingsForm = pojo.settingsForm ? new Form(pojo.settingsForm) : undefined;
    this.carriers = assert.array.nonEmpty(pojo.carriers, "carriers")
      .map((carrier) => new Carrier(this, carrier));

    // Store any user-defined methods as private fields.
    // For any methods that aren't implemented, set the corresponding class method to undefined.
    pojo.login
      ? (this._login = assert.type.function(pojo.login, "login method"))
      : (this.login = undefined);

    pojo.requestPickup
      ? (this._requestPickup = assert.type.function(pojo.requestPickup, "requestPickup method"))
      : (this.requestPickup = undefined);

    pojo.cancelPickup
      ? (this._cancelPickup = assert.type.function(pojo.cancelPickup, "cancelPickup method"))
      : (this.cancelPickup = undefined);

    pojo.createLabel
      ? (this._createLabel = assert.type.function(pojo.createLabel, "createLabel method"))
      : (this.createLabel = undefined);

    pojo.voidLabel
      ? (this._voidLabel = assert.type.function(pojo.voidLabel, "voidLabel method"))
      : (this.voidLabel = undefined);

    pojo.getRates
      ? (this._getRates = assert.type.function(pojo.getRates, "getRates method"))
      : (this.getRates = undefined);

    pojo.getTrackingURL
      ? (this._getTrackingURL = assert.type.function(pojo.getTrackingURL, "getTrackingUrl method"))
      : (this.getTrackingURL = undefined);

    pojo.track
      ? (this._track = assert.type.function(pojo.track, "track method"))
      : (this.track = undefined);

    pojo.createManifest
      ? (this._createManifest = assert.type.function(pojo.createManifest, "createManifest method"))
      : (this.createManifest = undefined);

    // Now that we're done configuring this entire app,
    // we no longer need to keep all the Config objects in memory
    this._references.finishedLoading();

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
    Object.freeze(this.carriers);
  }

  //#region Wrappers around user-defined methdos

  /**
   * Verifies a user's credentials and establishes or renews a session
   *
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async login?(transaction: TransactionPOJO): Promise<void> {
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
  public async requestPickup?(transaction: TransactionPOJO, request: PickupRequestPOJO)
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
  public async cancelPickup?(transaction: TransactionPOJO, cancellation: PickupCancellationPOJO)
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
  public async createLabel?(transaction: TransactionPOJO, label: LabelSpecPOJO): Promise<LabelConfirmation> {
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
  public async voidLabel?(transaction: TransactionPOJO): Promise<unknown> {
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
  public async getRates?(transaction: TransactionPOJO, criteria: RateCriteriaPOJO): Promise<RateQuote> {
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
  public getTrackingURL?(transaction: TransactionPOJO, criteria: TrackingCriteriaPOJO): URL | undefined {
    let _transaction, _criteria;

    try {
      _transaction = new Transaction(transaction);
      _criteria = new TrackingCriteria(this, criteria);
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.InvalidInput });
    }

    try {
      let url = this._getTrackingURL!(_transaction, _criteria);
      return url ? new URL(url as UrlString) : undefined;
    }
    catch (error) {
      throw ono(error, { code: ErrorCode.AppError, transactionID: _transaction.id }, `Error in getTrackingURL method.`);
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
  public async createManifest?(transaction: TransactionPOJO): Promise<unknown> {
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
}
