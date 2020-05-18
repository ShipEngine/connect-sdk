import { DateTimeZone, MonetaryValue, TimeRange } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { FulfillmentService } from "../fulfillment-service";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShippingCharge } from "../shipping-charge";
import { calculateTotalCharges } from "../utils";
import { ShipmentConfirmationPOJO } from "./shipment-confirmation-pojo";
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
      minimumDeliveryDays: Joi.number().integer().min(0),
      maximumDeliveryDays: Joi.number().integer().min(0),
      deliveryWindow: TimeRange[_internal].schema,
      zone: Joi.number().integer().min(1),
      isNegotiatedRate: Joi.boolean(),
      isGuaranteed: Joi.boolean(),
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
   * The minimum number of days delivery will take
   */
  public readonly minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  public readonly maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  public readonly deliveryWindow?: TimeRange;

  /**
   * Certain carriers base their rates off of zone numbers that vary based on the origin and destination
   *
   * @see https://stamps.custhelp.com/app/answers/detail/a_id/6118/~/all-about-usps-postal-zones
   */
  public readonly zone?: number;

  /**
   * Indicates whether this shipment used a pre-negotiated terms
   */
  public readonly isNegotiatedRate: boolean;

  /**
   * Indicates whether the carrier guarantees delivery by the `deliveryDateTime`
   */
  public readonly isGuaranteed: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  public get isTrackable(): boolean {
    return Boolean(this.trackingNumber || this.trackingURL);
  }

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
    this.minimumDeliveryDays = pojo.minimumDeliveryDays;
    this.maximumDeliveryDays = pojo.maximumDeliveryDays;
    this.deliveryWindow = pojo.deliveryWindow && new TimeRange(pojo.deliveryWindow);
    this.zone = pojo.zone;
    this.isNegotiatedRate = pojo.isNegotiatedRate || false;
    this.isGuaranteed = pojo.isGuaranteed || false;
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
