import { AddressWithContactInfoPOJO, DateTimeZonePOJO, SalesOrderShipment as ISalesOrderShipment, ShipmentIdentifierPOJO, URLString } from "../../../public";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../../carriers";
import { AddressWithContactInfo, DateTimeZone, hideAndFreeze, Joi, _internal } from "../../common";
import { SalesOrderPackageItem, SalesOrderPackageItemPOJO } from "./sales-order-package-item";


export interface SalesOrderShipmentPOJO extends ShipmentIdentifierPOJO {
  trackingURL?: URLString | URL;
  fulfillmentService?: string;
  shipFrom?: AddressWithContactInfoPOJO;
  shipTo: AddressWithContactInfoPOJO;
  shipDateTime: DateTimeZonePOJO | Date | string;
  contents: readonly SalesOrderPackageItemPOJO[];
}


export class SalesOrderShipment extends ShipmentIdentifierBase implements ISalesOrderShipment {
  public static readonly [_internal] = {
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

  public readonly trackingURL?: URL;
  public readonly fulfillmentService?: string;
  public readonly shipFrom?: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly shipDateTime: DateTimeZone;
  public readonly contents: readonly SalesOrderPackageItem[];


  public constructor(pojo: SalesOrderShipmentPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipFrom = pojo.shipFrom && new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.contents = (pojo.contents || []).map((item) => new SalesOrderPackageItem(item));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
