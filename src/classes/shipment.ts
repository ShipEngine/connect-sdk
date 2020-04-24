// tslint:disable: max-classes-per-file
import { assert } from "../assert";
import { Country } from "../countries";
import { BilledParty, InsuranceProvider, NonDeliveryAction } from "../enums";
import { ErrorCode, IpaasError, ipaasError } from "../errors";
import { Constructor } from "../internal-types";
import { NewShipmentPOJO, PackagePOJO, ShipmentIdentifierPOJO, ShipmentPOJO } from "../pojos";
import { Identifier } from "../types";
import { AddressWithContactInfo } from "./address";
import { App } from "./app";
import { DeliveryConfirmation, DeliveryService } from "./carrier";
import { MonetaryValue } from "./monetary-value";
import { NewPackage, Package } from "./package";

/**
 * Identifies a shipment
 */
export class ShipmentIdentifier extends shipmentIdentifierMixin() {
  public constructor(pojo: ShipmentIdentifierPOJO) {
    super(pojo, false);
  }
}

/**
 * A shipment that has not yet been created and has no identifiers yet
 */
export class NewShipment extends newShipmentMixin() {
  public constructor(app: App, pojo: NewShipmentPOJO) {
    super(app, pojo, false);
  }
}

/**
 * A shipment that has already been created and assigned identifiers
 */
export interface Shipment extends ShipmentIdentifier, NewShipment {}

/**
 * A shipment that has already been created and assigned identifiers
 */
export class Shipment extends newShipmentMixin(shipmentIdentifierMixin()) {
  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<Package>;

  public constructor(app: App, pojo: ShipmentPOJO) {
    super(app, pojo, true);
    this.packages = assert.array.nonEmpty(pojo.packages, "packages")
      .map((parcel: PackagePOJO) => new Package(app, parcel));

    // Prevent modifications after validation
    Object.freeze(this);
  }
}


function shipmentIdentifierMixin(base: Constructor = Object) {
  return class ShipmentIdentifierMixin extends base {
    /**
     * The carrier tracking number
     */
    public readonly trackingNumber: string;

    /**
     * Alternative identifiers associated with this shipment
     */
    public readonly identifiers: ReadonlyArray<Identifier>;

    public constructor(pojo: ShipmentIdentifierPOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "shipment");
      this.trackingNumber = assert.string.nonWhitespace(pojo.trackingNumber, "tracking number");
      this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "shipment identifiers", []);

      // Prevent modifications after validation
      Object.freeze(this.identifiers);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}

function newShipmentMixin(base: Constructor = Object) {
  return class NewShipmentMixin extends base {
    /**
     * The delivery service to use
     */
    public readonly deliveryService: DeliveryService;

    /**
     * The ID of the requested delivery confirmation
     */
    public readonly deliveryConfirmation?: DeliveryConfirmation;

    /**
     * The sender's contact info and address
     */
    public readonly shipFrom: AddressWithContactInfo;

    /**
     * The recipient's contact info and address
     */
    public readonly shipTo: AddressWithContactInfo;

    /**
     * The return address. Defautls to the `shipFrom` address
     */
    public readonly returnTo: AddressWithContactInfo;

    /**
     * The date/time that the package is expected to ship.
     * This is not guaranteed to be in the future.
     */
    public readonly shipDateTime: Date;

    /**
     * Indicates how a non-deliverable package should be handled
     */
    public readonly nonDeliveryAction: NonDeliveryAction;

    /**
     * Which party will be insuring the shipment
     */
    public readonly insuranceProvider: InsuranceProvider;

    /**
     * The total insured value of all packages in the shipment
     */
    public readonly totalInsuredValue: MonetaryValue;

    /**
     * The original (outgoing) shipment that this return shipment is for.
     * This associates the two shipments, which is required by some carriers.
     * This field is `undefined` if this is not a return shipment, or if no
     * outbound shipment was specified.
     */
    public readonly outboundShipment?: ShipmentIdentifier;

    /**
     * Indicates whether this is a return shipment
     */
    public readonly isReturn: boolean;

    /**
     * Indicates whether the shipment cannot be processed automatically due to size, shape, weight, etc.
     * and requires manual handling.
     *
     * This property is `true` if any package in the shipment is non-machineable.
     */
    public get isNonMachineable(): boolean {
      return this.packages.some((pkg) => pkg.isNonMachineable);
    }

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
     * The list of packages in the shipment
     */
    public readonly packages: ReadonlyArray<NewPackage>;

    public constructor(app: App, pojo: NewShipmentPOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "shipment");
      this.deliveryService = app._references.lookup(pojo.deliveryServiceID, DeliveryService, "delivery service");
      this.deliveryConfirmation = app._references.get(pojo.deliveryConfirmationID, DeliveryConfirmation, "delivery confirmation");
      this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
      this.shipTo = new AddressWithContactInfo(pojo.shipTo);
      this.returnTo = pojo.returnTo
        ? new AddressWithContactInfo(pojo.returnTo)
        : new AddressWithContactInfo(pojo.shipFrom);
      this.shipDateTime = assert.type.date(pojo.shipDateTime, "shipment date/time");
      this.nonDeliveryAction = assert.string.enum(pojo.nonDeliveryAction, NonDeliveryAction, "non-delivery action");
      this.insuranceProvider = assert.string.enum(
          pojo.insuranceProvider, InsuranceProvider, "insurance provider", InsuranceProvider.Carrier);
      this.outboundShipment = pojo.outboundShipment && new ShipmentIdentifier(pojo.outboundShipment);
      this.isReturn = assert.type.boolean(pojo.isReturn, "isReturn flag", false);

      // If there is no billing info, then the sender is billed by default.
      // If billing a third-party, then account, postalCode, and country are required.
      let billing = assert.type.object(pojo.billing, "billing info", {});
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

      this.packages = assert.array.nonEmpty(pojo.packages, "packages")
        .map((parcel: PackagePOJO) => new NewPackage(app, parcel));

      // NOTE: This must be calculated AFTER setting the packages property
      this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

      // Prevent modifications after validation
      Object.freeze(this.billing);
      Object.freeze(this.packages);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}

/**
 * Calculates the total insurance amount for the shipment,
 * which is the sum of the insured value of all packages.
 */
function calculateTotalInsuranceAmount(packages: ReadonlyArray<NewPackage>): MonetaryValue {
  try {
    let insuredValues = packages.map((parcel) => parcel.insuredValue);
    return MonetaryValue.sum(insuredValues);
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as IpaasError).code === ErrorCode.CurrencyMismatch) {
      throw ipaasError(
        ErrorCode.CurrencyMismatch,
        "All packages in a shipment must be insured in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}
