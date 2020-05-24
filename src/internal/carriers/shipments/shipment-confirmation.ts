import { FulfillmentService, ShipmentConfirmation as IShipmentConfirmation, ShipmentConfirmationPOJO } from "../../../public";
import { calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, TimeRange, _internal } from "../../common";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "./shipment-identifier";

export class ShipmentConfirmation extends ShipmentIdentifierBase implements IShipmentConfirmation {
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
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
      metadata: Joi.object(),
    }),
  };

  public readonly trackingURL?: URL;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly minimumDeliveryDays?: number;
  public readonly maximumDeliveryDays?: number;
  public readonly deliveryWindow?: TimeRange;
  public readonly zone?: number;
  public readonly isNegotiatedRate: boolean;
  public readonly isGuaranteed: boolean;
  public readonly charges: ReadonlyArray<Charge>;
  public readonly totalAmount: MonetaryValue;
  public readonly packages: ReadonlyArray<PackageConfirmation>;
  public readonly metadata: object;

  public get isTrackable(): boolean {
    return Boolean(this.trackingNumber || this.trackingURL);
  }

  public get package(): PackageConfirmation {
    return this.packages[0];
  }

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
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
