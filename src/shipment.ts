// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { NewShipmentConfig, PackageConfig, ShipmentConfig, ShipmentIdentifierConfig } from "./config";
import { Country } from "./countries";
import { BilledParty, InsuranceProvider, NonDeliveryAction } from "./enums";
import { MonetaryValue } from "./measures";
import { NewPackage, Package } from "./package";
import { DeliveryConfirmation, DeliveryService, ShippingProviderApp } from "./shipping-provider";
import { Identifier } from "./types";

/**
 * Identifies a shipment
 */
export class ShipmentIdentifier {
  /**
   * The carrier tracking number
   */
  public readonly trackingNumber: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  public readonly identifiers: Identifier[];

  public constructor(config: ShipmentIdentifierConfig) {
    assert.type.object(config, "shipment");
    this.trackingNumber = assert.string.nonWhitespace(config.trackingNumber, "tracking number");
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "shipment identifiers", []);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}

/**
 * A shipment that has not yet been created and has no identifiers yet
 */
export class NewShipment {
  /**
   * The delivery service to use
   */
  public readonly deliveryService: DeliveryService;

  /**
   * The ID of the requested delivery confirmation
   */
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  public readonly shipmentDate: Date;

  /**
   * Indicates how a non-deliverable package should be handled
   */
  public readonly nonDeliveryAction: NonDeliveryAction;

  /**
   * Billing details.
   */
  public billing: {
    /**
     * Indicates who customs duties are billed to. Defaults to the sender
     */
    dutiesPaidBy: BilledParty;

    /**
     * Indicates who delivery charges are billed to. Defaults to the sender
     */
    deliveryPaidBy: BilledParty;

    /**
     * The account number of the third-party that is responsible for shipping costs
     */
    account?: string;

    /**
     * The postal code of the third-party that is responsible for shipping costs
     */
    postalCode?: string;

    /**
     * The country of the third-party that is responsible for shipping costs
     */
    country?: Country;
  };

  /**
   * Information about the insurance for the shipment.
   * If `undefined`, then the shipment is uninsured.
   */
  public readonly insurance?: {
    /**
     * Which party will be insuring the shipment
     */
    readonly provider: InsuranceProvider;

    /**
     * The total insured value of the shipment.
     * This is the sum of the insured value of each package.
     */
    readonly amount: MonetaryValue;
  };

  /**
   * Information that is specific to return shipments.
   * If `undefined`, then the shipment is not a return.
   */
  public readonly return?: {
    /**
     * The original (outgoing) shipment that this return shipment is for.
     * This associates the two shipments, which is required by some carriers.
     * This field is `undefined` if the outbound shipment was not specified.
     */
    readonly outboundShipment?: ShipmentIdentifier;

    /**
     * The Return Merchandise Authorization number, if any.
     */
    readonly rmaNumber?: string;
  };

  /**
   * The list of packages in the shipment
   */
  public readonly packages: NewPackage[];

  public constructor(app: ShippingProviderApp, config: NewShipmentConfig) {
    assert.type.object(config, "shipment");
    this.deliveryService = app.getDeliveryService(config.deliveryServiceID);
    this.deliveryConfirmation = config.deliveryConfirmationID === undefined ? undefined
      : app.getDeliveryConfirmation(config.deliveryConfirmationID);
    this.shipmentDate = assert.type.date(config.shipmentDate, "shipment date");
    this.nonDeliveryAction = assert.string.enum(config.nonDeliveryAction, NonDeliveryAction, "non-delivery action");

    // If there is no billing info, then the sender is billed by default.
    // If billing a third-party, then account, postalCode, and country are required.
    let billing = assert.type.object(config.billing, "billing info", {});
    let isThirdParty =
      (billing.dutiesPaidBy === BilledParty.ThirdParty) || (billing.deliveryPaidBy === BilledParty.ThirdParty);

    this.billing = {
      dutiesPaidBy: assert.string.enum(billing.dutiesPaidBy, BilledParty, "dutiesPaidBy", BilledParty.Sender),
      deliveryPaidBy: assert.string.enum(billing.deliveryPaidBy, BilledParty, "deliveryPaidBy", BilledParty.Sender),
      account: billing.account || isThirdParty
        ? assert.string.nonWhitespace(billing.account, "billing account") : undefined,
      postalCode: billing.postalCode || isThirdParty
        ? assert.string.nonWhitespace(billing.postalCode, "billing postal code") : undefined,
      country: billing.country || isThirdParty
        ? assert.string.enum(billing.country, Country, "billing country") : undefined,
    };

    if (config.insurance) {
      assert.type.object(config.insurance, "insurance info");
      this.insurance = {
        provider: assert.string.enum(config.insurance.provider, InsuranceProvider, "insurance provider"),
        amount: new MonetaryValue(config.insurance.amount),
      };
    }

    if (config.return) {
      assert.type.object(config.return, "return info");
      this.return = {
        outboundShipment: config.return.outboundShipment && new ShipmentIdentifier(config.return.outboundShipment),
        rmaNumber: config.return.rmaNumber && assert.string.nonWhitespace(config.return.rmaNumber, "RMA number"),
      };
    }

    this.packages = assert.array.nonEmpty(config.packages, "packages")
      .map((parcel: PackageConfig) => new NewPackage(app, parcel));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.packages);
  }
}

/**
 * A shipment that has already been created and assigned identifiers
 */
export class Shipment extends NewShipment {
  /**
   * The carrier tracking number
   */
  public readonly trackingNumber!: string;

  /**
   * Alternative identifiers associated with this shipment
   */
  public readonly identifiers!: Identifier[];

  /**
   * The list of packages in the shipment
   */
  public readonly packages: Package[];

  public constructor(app: ShippingProviderApp, config: ShipmentConfig) {
    super(app, config);
    this.packages = assert.array.nonEmpty(config.packages, "packages")
      .map((parcel: PackageConfig) => new Package(app, parcel));
    ShipmentIdentifier.call(this, config);
  }
}
