import { DateTimeZone, DateTimeZonePOJO, MonetaryValue } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { URLString } from "../../types";
import { FulfillmentService } from "../fulfillment-service";
import { PackageConfirmation, PackageConfirmationPOJO } from "../packages/package-confirmation";
import { ShippingCharge } from "../shipping-charge";
import { ShippingChargePOJO } from "../shipping-charge-pojo";
import { calculateTotalCharges } from "../utils";
import { ShipmentIdentifier, shipmentIdentifierMixin, ShipmentIdentifierPOJO } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export interface ShipmentConfirmationPOJO extends ShipmentIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the shipment
   */
  trackingURL?: URLString | URL;

  /**
   * If the shipment is being fulfilled using a well-known third-party carrier, such as UPS, FedEx, DHL, etc.
   * then specify the carrier service here.
   */
  fulfillmentService?: FulfillmentService;

  /**
   * The estimated date and time the shipment will be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * The breakdown of charges for this shipment.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ShippingChargePOJO[];

  /**
   * Confirmation details about each package in the shipment
   */
  packages: PackageConfirmationPOJO[];

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


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
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  public get package(): PackageConfirmation {
    return this.packages[0];
  }

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentConfirmation);
