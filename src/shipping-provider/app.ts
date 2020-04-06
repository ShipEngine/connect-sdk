import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import * as path from "path";
import { AppManifest } from "../app-manifest";
import { assert } from "../assert";
import { DeliveryServiceConfig, FormConfig, LabelSpecConfig, LogoConfig, PickupCancellationConfig, PickupRequestConfig, PickupServiceConfig, ShippingProviderConfig, TransactionConfig } from "../config";
import { readConfig } from "../read-config";
import { Transaction } from "../transaction";
import { UUID } from "../types";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { DeliveryService } from "./delivery-service";
import { Form } from "./form";
import { LabelSpec } from "./labels/label-spec";
import { Logo } from "./logo";
import { CancelPickup, CreateLabel, CreateManifest, GetRates, GetTrackingUrl, Login, RequestPickup, Track, VoidLabel } from "./methods";
import { Packaging } from "./packaging";
import { PickupService } from "./pickup-service";
import { PickupCancellation } from "./pickups/pickup-cancellation";
import { PickupCancellationConfirmation } from "./pickups/pickup-cancellation-confirmation";
import { PickupConfirmation } from "./pickups/pickup-confirmation";
import { PickupRequest } from "./pickups/pickup-request";

/**
 * A ShipEngine IPaaS shipping provider app.
 */
export class ShippingProviderApp {
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
  public readonly deliveryServices: DeliveryService[];

  /**
   * The package pickup services that are offered
   */
  public readonly pickupServices: PickupService[];

  /**
   * A form that allows the user to enter their login credentials
   */
  public readonly loginForm: Form;

  /**
   * A form that allows the user to configure settings
   */
  public readonly settingsForm: Form | undefined;

  // Store the user-defined methods as private fields.
  // We wrap these methods with our own signatures below
  readonly #login: Login | undefined;                          // tslint:disable-line: member-access
  readonly #requestPickup: RequestPickup | undefined;          // tslint:disable-line: member-access
  readonly #cancelPickup: CancelPickup | undefined;            // tslint:disable-line: member-access
  readonly #createLabel: CreateLabel | undefined;              // tslint:disable-line: member-access
  readonly #voidLabel: VoidLabel | undefined;                  // tslint:disable-line: member-access
  readonly #getRates: GetRates | undefined;                    // tslint:disable-line: member-access
  readonly #getTrackingUrl: GetTrackingUrl | undefined;        // tslint:disable-line: member-access
  readonly #track: Track | undefined;                          // tslint:disable-line: member-access
  readonly #createManifest: CreateManifest | undefined;        // tslint:disable-line: member-access

  /**
   * Creates a ShipEngine IPaaS shipping provider app from a fully-resolved config object
   */
  public constructor(manifest: AppManifest, config: ShippingProviderConfig) {
    assert.type.object(config, "ShipEngine IPaaS app");
    this.name = assert.string.nonWhitespace(config.name, "shipping provider name");
    this.description = assert.string(config.description, "shipping provider description", "");
    this.websiteURL = new URL(assert.string.nonWhitespace(config.websiteURL, "websiteURL"));
    this.logo = new Logo(config.logo as LogoConfig);
    this.deliveryServices = assert.array.nonEmpty(config.deliveryServices, "deliveryServices")
      .map((svc: DeliveryServiceConfig) => new DeliveryService(svc));
    this.pickupServices = assert.array(config.pickupServices, "pickupServices", [])
      .map((svc: PickupServiceConfig) => new PickupService(svc));
    this.loginForm = new Form(config.loginForm as FormConfig);
    this.settingsForm = config.loginForm ? new Form(config.loginForm as FormConfig) : undefined;

    // Store any user-defined methods as private fields.
    // For any methods that aren't implemented, set the corresponding class method to undefined.
    config.login
      ? (this.#login = assert.type.function(config.login as Login, "login method"))
      : (this.login = undefined);

    config.requestPickup
      ? (this.#requestPickup = assert.type.function(config.requestPickup as RequestPickup, "requestPickup method"))
      : (this.requestPickup = undefined);

    config.cancelPickup
      ? (this.#cancelPickup = assert.type.function(config.cancelPickup as CancelPickup, "cancelPickup method"))
      : (this.cancelPickup = undefined);

    config.createLabel
      ? (this.#createLabel = assert.type.function(config.createLabel as CreateLabel, "createLabel method"))
      : (this.createLabel = undefined);

    config.voidLabel
      ? (this.#voidLabel = assert.type.function(config.voidLabel as VoidLabel, "voidLabel method"))
      : (this.voidLabel = undefined);

    config.getRates
      ? (this.#getRates = assert.type.function(config.getRates as GetRates, "getRates method"))
      : (this.getRates = undefined);

    config.getTrackingUrl
      ? (this.#getTrackingUrl = assert.type.function(config.getTrackingUrl as GetTrackingUrl, "getTrackingUrl method"))
      : (this.getTrackingUrl = undefined);

    config.track
      ? (this.#track = assert.type.function(config.track as Track, "track method"))
      : (this.track = undefined);

    config.createManifest
      ? (this.#createManifest = assert.type.function(config.createManifest as CreateManifest, "createManifest method"))
      : (this.createManifest = undefined);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.websiteURL);
    Object.freeze(this.deliveryServices);
    Object.freeze(this.pickupServices);
  }

  /**
   * Imports a ShipEngine IPaaS shipping provider app
   */
  public static async import(appPath: string): Promise<ShippingProviderApp> {
    let manifest = await ShippingProviderApp.readManifest(appPath);
    let config = await ShippingProviderApp.readConfig(appPath);
    return new ShippingProviderApp(manifest, config);
  }

  /**
   * Reads the ShipEngine IPaaS shipping provider app manifest (package.json file)
   */
  public static async readManifest(appPath: string): Promise<AppManifest> {
    let manifestPath = path.join(appPath, "package.json");

    try {
      return await readConfig<AppManifest>(manifestPath, "package.json");
    }
    catch (error) {
      throw ono(error, `Error reading the ShipEngine IPaaS app: ${humanize(manifestPath)}`);
    }
  }

  /**
   * Reads the config for a ShipEngine IPaaS shipping provider app
   */
  public static async readConfig(appPath: string): Promise<ShippingProviderConfig> {
    try {
      let config = await readConfig<ShippingProviderConfig>(appPath);

      return {
        ...config,
        logo: await Logo.readConfig(config.logo),
        deliveryServices: await DeliveryService.readArrayConfig(config.deliveryServices),
        pickupServices: config.pickupServices && await PickupService.readArrayConfig(config.pickupServices),
        loginForm: await Form.readConfig(config.loginForm),
        settingsForm: config.settingsForm && await Form.readConfig(config.settingsForm),
        login: await readConfig(config.login),
        requestPickup: await readConfig(config.requestPickup),
        cancelPickup: await readConfig(config.cancelPickup),
        createLabel: await readConfig(config.createLabel),
        voidLabel: await readConfig(config.voidLabel),
        getRates: await readConfig(config.getRates),
        getTrackingUrl: await readConfig(config.getTrackingUrl),
        track: await readConfig(config.track),
        createManifest: await readConfig(config.createManifest),
      };
    }
    catch (error) {
      throw ono(error, `Error reading the ShipEngine IPaaS app config: ${humanize(appPath)}`);
    }
  }

  /**
   * Verifies a user's credentials and establishes or renews a session
   *
   * NOTE: This function does not return a value. It updates the `transaction.session` property.
   */
  public async login?(transaction: TransactionConfig): Promise<void> {
    try {
      await this.#login!(new Transaction(transaction));
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in login method.`);
    }
  }

  /**
   * Requests a package pickup at a time and place
   */
  public async requestPickup?(transaction: TransactionConfig, request: PickupRequestConfig)
  : Promise<PickupConfirmation> {
    try {
      let confirmation = await this.#requestPickup!(
        new Transaction(transaction),
        new PickupRequest(this, request),
      );

      confirmation.shipments = confirmation.shipments || request.shipments;
      return new PickupConfirmation(confirmation);
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in requestPickup method.`);
    }
  }

  /**
   * Cancels a previously-requested package pickup
   */
  public async cancelPickup?(transaction: TransactionConfig, cancellation: PickupCancellationConfig)
  : Promise<PickupCancellationConfirmation> {
    try {
      let confirmation = await this.#cancelPickup!(
        new Transaction(transaction),
        new PickupCancellation(this, cancellation),
      );

      confirmation = confirmation || { successful: true };
      return new PickupCancellationConfirmation(confirmation);
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in cancelPickup method.`);
    }
  }

  /**
   * Creates a shipping label
   */
  public async createLabel?(transaction: TransactionConfig, label: LabelSpecConfig): Promise<void> {
    try {
      await this.#createLabel!(
        new Transaction(transaction),
        new LabelSpec(this, label),
      );
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in createLabel method.`);
    }
  }

  /**
   * Voids a previously-created shipping label
   */
  public async voidLabel?(transaction: TransactionConfig): Promise<void> {
    try {
      await Promise.resolve();
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in voidLabel method.`);
    }
  }

  /**
   * Gets shipping rates for a shipment
   */
  public async getRates?(transaction: TransactionConfig): Promise<void> {
    try {
      await Promise.resolve();
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in getRates method.`);
    }
  }

  /**
   * Returns the web page URL where a customer can track a shipment
   */
  public async getTrackingUrl?(transaction: TransactionConfig): Promise<void> {
    try {
      await Promise.resolve();
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in getTrackingUrl method.`);
    }
  }

  /**
   * Returns tracking details for a shipment
   */
  public async track?(transaction: TransactionConfig): Promise<void> {
    try {
      await Promise.resolve();
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in track method.`);
    }
  }

  /**
   * Creates a manifest for multiple shipments
   */
  public async createManifest?(transaction: TransactionConfig): Promise<void> {
    try {
      await Promise.resolve();
    }
    catch (error) {
      throw ono(error, { transactionID: transaction.id }, `Error in createManifest method.`);
    }
  }

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
}
