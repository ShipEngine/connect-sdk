import { FulfillmentService } from "../../../enums";
import { hideAndFreeze, Joi, validate, _internal } from "../../../internal";
import { ShipmentConfirmationPOJO } from "../../../pojos/carrier";
import { DateTimeZone, MonetaryValue } from "../../common";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShippingCharge } from "../shipping-charge";
import { calculateTotalCharges } from "../utils";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export class ShipmentConfirmation extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      deliveryDateTime: DateTimeZone[_internal].schema,
      charges: Joi.array().min(1).items(ShippingCharge[_internal].schema).required(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The URL of a webpage where the customer can track the shipment
   */
  public readonly trackingURL?: URL;

  /**
   * A well-known carrier service that's being used to fulfill this shipment
   */
  public readonly fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: DateTimeZone;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this label.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * Confirmation details about each package in the shipment
   */
  public readonly packages: ReadonlyArray<PackageConfirmation>;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata?: object;

  //#endregion

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    validate(pojo, ShipmentConfirmation);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.metadata = pojo.metadata;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentConfirmation);
