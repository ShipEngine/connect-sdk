import { SalesOrderShipment as ISalesOrderShipment, SalesOrderShipment as SalesOrderShipmentPOJO } from "../../../definitions";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../../carriers";
import { AddressWithContactInfo, DateTimeZone, hideAndFreeze, Joi, _internal } from "../../common";
import { SalesOrderPackageItem } from "./sales-order-package-item";

export class SalesOrderShipment extends ShipmentIdentifierBase implements ISalesOrderShipment {
  public static [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      fulfillmentService: Joi.string(),
      shipFrom: AddressWithContactInfo[_internal].schema,
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      contents: Joi.array().min(1).items(SalesOrderPackageItem[_internal].schema).required(),
    }),
  };

  public trackingURL?: URL;
  public fulfillmentService?: string;
  public shipFrom?: AddressWithContactInfo;
  public shipTo: AddressWithContactInfo;
  public shipDateTime: DateTimeZone;
  public contents: Array<SalesOrderPackageItem>;


  public constructor(pojo: SalesOrderShipmentPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? pojo.trackingURL : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipFrom = pojo.shipFrom && new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.contents = (pojo.contents || []).map((item) => new SalesOrderPackageItem(item));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
