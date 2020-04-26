import { Country } from "../../countries";
import { ServiceArea } from "../../enums";
import { error, ErrorCode } from "../../errors";
import { LabelSpecPOJO, PickupCancellationPOJO, PickupRequestPOJO, RateCriteriaPOJO, ShippingProviderPOJO, TrackingCriteriaPOJO } from "../../pojos/carrier";
import { TransactionPOJO } from "../../pojos/common";
import { UrlString, UUID } from "../../types";
import { Joi, validate } from "../../validation";
import { App, Logo, Transaction } from "../common";
import { Form } from "../connection";
import { Carrier } from "./carrier";
import { DeliveryService } from "./delivery-service";
import { LabelConfirmation } from "./labels/label-confirmation";
import { LabelSpec } from "./labels/label-spec";
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
 * A shipping provider provides delivery services for one or more carriers
 */
export class ShippingProvider {
  //#region Class Fields

  public static readonly label = "shipping provider";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    websiteURL: Joi.string().website().required(),
    logo: Logo.schema.required(),
    loginForm: Form.schema.required(),
    settingsForm: Form.schema,
    carriers: Joi.array().min(1).items(Carrier.schema).required(),
    login: Joi.function(),
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
   * The ShipEngine Integration Platform app that this shipping provider is part of.
   */
  public readonly app: App;

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
    return this.deliveryServices.some((svc) => svc.isConsolidationService);
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

  public constructor(pojo: ShippingProviderPOJO, app: App) {
    validate(pojo, ShippingProvider);

    this.app = app;
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo = new Logo(pojo.logo);
    this.loginForm = new Form(pojo.loginForm);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);
    this.carriers = pojo.carriers.map((carrier) => new Carrier(carrier, app));

    // Store any user-defined methods as private fields.
    // For any methods that aren't implemented, set the corresponding class method to undefined.
    pojo.login ? (this._login = pojo.login) : (this.login = undefined);
    pojo.requestPickup ? (this._requestPickup = pojo.requestPickup) : (this.requestPickup = undefined);
    pojo.cancelPickup ? (this._cancelPickup = pojo.cancelPickup) : (this.cancelPickup = undefined);
    pojo.createLabel ? (this._createLabel = pojo.createLabel) : (this.createLabel = undefined);
    pojo.voidLabel ? (this._voidLabel = pojo.voidLabel) : (this.voidLabel = undefined);
    pojo.getRates ? (this._getRates = pojo.getRates) : (this.getRates = undefined);
    pojo.getTrackingURL ? (this._getTrackingURL = pojo.getTrackingURL) : (this.getTrackingURL = undefined);
    pojo.track ? (this._track = pojo.track) : (this.track = undefined);
    pojo.createManifest ? (this._createManifest = pojo.createManifest) : (this.createManifest = undefined);

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
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the login method.", { originalError });
    }

    try {
      await this._login!(_transaction);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in login method.`, { originalError, transactionID });
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
      _request = new PickupRequest(request, this.app);
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
      _cancellation = new PickupCancellation(cancellation, this.app);
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
      _label = new LabelSpec(label, this.app);
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
      _criteria = new RateCriteria(criteria, this.app);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getRates method.", { originalError });
    }

    try {
      let quote = await this._getRates!(_transaction, _criteria);
      return new RateQuote(quote, this.app);
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
      _criteria = new TrackingCriteria(criteria, this.app);
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
