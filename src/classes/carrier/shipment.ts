// tslint:disable: max-classes-per-file
import { DeliveryConfirmation, DeliveryService } from ".";
import { Country } from "../../countries";
import { BilledParty, InsuranceProvider, NonDeliveryAction } from "../../enums";
import { error, ErrorCode, ShipEngineError } from "../../errors";
import { Constructor } from "../../internal-types";
import { NewShipmentPOJO, PackagePOJO, ShipmentIdentifierPOJO, ShipmentPOJO } from "../../pojos/carrier";
import { Joi } from "../../validation";
import { AddressWithContactInfo } from "../common/address";
import { App } from "../common/app";
import { Identifier } from "../common/custom-data";
import { MonetaryValue } from "../common/monetary-value";
import { NewPackage, Package } from "./package";

/**
 * Identifies a shipment
 */
export class ShipmentIdentifier extends shipmentIdentifierMixin() {
  //#region Class Fields

  public static readonly label = "shipment";

  /** @internal */
  public static readonly schema = Joi.object({
    trackingNumber: Joi.string().trim().singleLine().min(1).max(100).required(),
    identifiers: Joi.array().items(Identifier.schema),
  });

  //#endregion

  public constructor(pojo: ShipmentIdentifierPOJO) {
    super(pojo);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}


function shipmentIdentifierMixin(base: Constructor = Object) {
  return class ShipmentIdentifierMixin extends base {
    //#region Instance Fields

    /**
     * The carrier tracking number
     */
    public readonly trackingNumber: string;

    /**
     * Alternative identifiers associated with this shipment
     */
    public readonly identifiers: ReadonlyArray<Identifier>;

    //#endregion

    public constructor(pojo: ShipmentIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.trackingNumber = pojo.trackingNumber;
      this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];

      // Prevent modifications after validation
      Object.freeze(this.identifiers);
    }
  };
}


/**
 * A shipment that has not yet been created and has no identifiers yet
 */
export class NewShipment extends newShipmentMixin() {
  //#region Class Fields

  public static readonly label = "shipment";

  /** @internal */
  public static readonly schema = Joi.object({
    deliveryServiceID: Joi.string().uuid().required(),
    deliveryConfirmationID: Joi.string().uuid().required(),
    shipFrom: AddressWithContactInfo.schema.required(),
    shipTo: AddressWithContactInfo.schema.required(),
    returnTo: AddressWithContactInfo.schema,
    shipDateTime: Joi.date().required(),
    nonDeliveryAction: Joi.string().enum(NonDeliveryAction).required(),
    insuranceProvider: Joi.string().enum(InsuranceProvider),
    outboundShipment: ShipmentIdentifier.schema,
    isReturn: Joi.boolean(),
    billing: Joi.object({
      dutiesPaidBy: Joi.string().enum(BilledParty),
      deliveryPaidBy: Joi.string().enum(BilledParty),
      account: Joi.string().trim().singleLine().allow("").max(100)
        .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() })
        .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() }),
      postalCode: Joi.string().trim().singleLine().allow("").max(100)
        .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() })
        .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() }),
      country: Joi.string().enum(Country)
        .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.required() })
        .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.required() }),
    }),
    packages: Joi.array().min(1).items(NewPackage.schema).required(),
  });

  //#endregion

  public constructor(pojo: NewShipmentPOJO, app: App) {
    super(pojo, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

function newShipmentMixin(base: Constructor = Object) {
  return class NewShipmentMixin extends base {
    //#region Instance Fields

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
      account: string;

      /**
       * The postal code of the third-party that is responsible for shipping costs
       */
      postalCode: string;

      /**
       * The country of the third-party that is responsible for shipping costs
       */
      country?: Country;
    };

    /**
     * The list of packages in the shipment
     */
    public readonly packages: ReadonlyArray<NewPackage>;

    //#endregion

    public constructor(pojo: NewShipmentPOJO, app: App) {
      base === Object ? super() : super(pojo);

      this.deliveryService = app._references.lookup(pojo.deliveryServiceID, DeliveryService);
      this.deliveryConfirmation = app._references.get(pojo.deliveryConfirmationID, DeliveryConfirmation);
      this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
      this.shipTo = new AddressWithContactInfo(pojo.shipTo);
      this.returnTo = pojo.returnTo
        ? new AddressWithContactInfo(pojo.returnTo)
        : new AddressWithContactInfo(pojo.shipFrom);
      this.shipDateTime = pojo.shipDateTime;
      this.nonDeliveryAction = pojo.nonDeliveryAction;
      this.insuranceProvider = pojo.insuranceProvider || InsuranceProvider.Carrier;
      this.outboundShipment = pojo.outboundShipment && new ShipmentIdentifier(pojo.outboundShipment);
      this.isReturn = pojo.isReturn || false;

      // If there is no billing info, then the sender is billed by default.
      let billing = pojo.billing || {};
      this.billing = {
        dutiesPaidBy: billing.dutiesPaidBy || BilledParty.Sender,
        deliveryPaidBy: billing.deliveryPaidBy || BilledParty.Sender,
        account: billing.account || "",
        postalCode: billing.postalCode || "",
        country: billing.country
      };

      this.packages = pojo.packages.map((parcel) => new NewPackage(parcel, app));
      this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

      // Prevent modifications after validation
      Object.freeze(this.billing);
      Object.freeze(this.packages);
    }
  };
}


/**
 * A shipment that has already been created and assigned identifiers
 */
export interface Shipment extends ShipmentIdentifier, NewShipment {}

/**
 * A shipment that has already been created and assigned identifiers
 */
export class Shipment extends newShipmentMixin(shipmentIdentifierMixin()) {
  //#region Class Fields

  public static readonly label = "shipment";

  /** @internal */
  public static readonly schema = ShipmentIdentifier.schema.concat(NewShipment.schema).keys({
    packages: Joi.array().min(1).items(Package.schema).required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<Package>;

  //#endregion

  public constructor(pojo: ShipmentPOJO, app: App) {
    super(pojo, app);

    this.packages = pojo.packages.map((parcel: PackagePOJO) => new Package(parcel, app));

    // Prevent modifications after validation
    Object.freeze(this);
  }
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
    if ((originalError as ShipEngineError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch,
        "All packages in a shipment must be insured in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}
