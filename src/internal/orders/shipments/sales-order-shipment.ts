import { FulfillmentService, SalesOrderShipment as ISalesOrderShipment, SalesOrderShipmentPOJO } from "../../../public";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../../carriers";
import { AddressWithContactInfo, DateTimeZone, hideAndFreeze, Joi, TimeRange, _internal } from "../../common";
import { SalesOrderPackage } from "./sales-order-package";

export class SalesOrderShipment extends ShipmentIdentifierBase implements ISalesOrderShipment {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      minimumDeliveryDays: Joi.number().integer().min(0),
      maximumDeliveryDays: Joi.number().integer().min(0),
      deliveryWindow: TimeRange[_internal].schema,
      packages: Joi.array().min(1).items(SalesOrderPackage[_internal].schema).required(),
    }),
  };

  public readonly trackingURL?: URL;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly shipFrom: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly shipDateTime: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly minimumDeliveryDays?: number;
  public readonly maximumDeliveryDays?: number;
  public readonly deliveryWindow?: TimeRange;
  public readonly packages: ReadonlyArray<SalesOrderPackage>;

  public get package(): SalesOrderPackage {
    return this.packages[0];
  }

  public constructor(pojo: SalesOrderShipmentPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.minimumDeliveryDays = pojo.minimumDeliveryDays;
    this.maximumDeliveryDays = pojo.maximumDeliveryDays;
    this.deliveryWindow = pojo.deliveryWindow && new TimeRange(pojo.deliveryWindow);
    this.packages = pojo.packages.map((parcel) => new SalesOrderPackage(parcel));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
