import { BilledParty, Country, InsuranceProvider, NonDeliveryAction } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { NewShipmentPOJO } from "../../../pojos/carrier";
import { AddressWithContactInfo, DateTimeZone, MonetaryValue } from "../../common";
import { App } from "../../common/app";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryService } from "../delivery-service";
import { NewPackage } from "../packages/new-package";
import { calculateTotalInsuranceAmount } from "../utils";
import { ShipmentIdentifier } from "./shipment-identifier";


/**
 * The information needed to create a new shipment
 */
export class NewShipment {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryServiceID: Joi.string().uuid().required(),
      deliveryConfirmationID: Joi.string().uuid(),
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returnTo: AddressWithContactInfo[_internal].schema,
      shipDateTime: DateTimeZone[_internal].schema.required(),
      nonDeliveryAction: Joi.string().enum(NonDeliveryAction),
      insuranceProvider: Joi.string().enum(InsuranceProvider),
      isReturn: Joi.boolean(),
      rmaNumber: Joi.string().trim().singleLine().min(1).max(100),
      outboundShipment: ShipmentIdentifier[_internal].schema,
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
      packages: Joi.array().min(1).items(NewPackage[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The delivery service to use
   */
  public readonly deliveryService: DeliveryService;

  /**
   * The requested delivery confirmation
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
  public readonly shipDateTime: DateTimeZone;

  /**
   * Indicates how a non-deliverable package should be handled. If `undefined`,
   * the carrier's default behavior applies, which may incur charges.
   */
  public readonly nonDeliveryAction?: NonDeliveryAction;

  /**
   * Which party will be insuring the shipment
   */
  public readonly insuranceProvider: InsuranceProvider;

  /**
   * The total insured value of all packages in the shipment
   */
  public readonly totalInsuredValue: MonetaryValue;

  /**
   * Indicates whether this is a return shipment
   */
  public readonly isReturn: boolean;

  /**
   * A return merchandise authorization (RMA) is an associated number assigned to process the return,
   * this number is often printed on the label, and used when the original shipper processes the inbound return.
   */
  public readonly rmaNumber: string;

  /**
   * The original (outgoing) shipment that this return shipment is for.
   * This associates the two shipments, which is required by some carriers.
   * This field is `undefined` if this is not a return shipment, or if no
   * outbound shipment was specified.
   */
  public readonly outboundShipment?: ShipmentIdentifier;

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
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryServiceID, DeliveryService);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmationID, DeliveryConfirmation);
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.returnTo = pojo.returnTo
      ? new AddressWithContactInfo(pojo.returnTo)
      : new AddressWithContactInfo(pojo.shipFrom);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.nonDeliveryAction = pojo.nonDeliveryAction;
    this.insuranceProvider = pojo.insuranceProvider || InsuranceProvider.Carrier;
    this.isReturn = pojo.isReturn || false;
    this.rmaNumber = pojo.rmaNumber || "";
    this.outboundShipment = pojo.outboundShipment && new ShipmentIdentifier(pojo.outboundShipment);

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

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewShipment);
