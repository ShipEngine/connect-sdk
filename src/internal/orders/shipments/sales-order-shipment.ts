import { AddressWithContactInfoPOJO, ChargePOJO, DateTimeZonePOJO, SalesOrderIdentifierPOJO, SalesOrderShipment as ISalesOrderShipment, ShipmentIdentifierPOJO, URLString } from "../../../public";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../../carriers";
import { AddressWithContactInfo, DateTimeZone, Charge, hideAndFreeze, Joi, _internal } from "../../common";
import { SalesOrderPackageItem, SalesOrderPackageItemPOJO } from "./sales-order-package-item";
import { SalesOrderIdentifier } from "../../orders/sales-order-identifier";

export interface SalesOrderShipmentPOJO extends ShipmentIdentifierPOJO {
  trackingURL?: URLString | URL;
  salesOrder: SalesOrderIdentifierPOJO;
  carrierCode?: string;
  carrierServiceCode?: string;
  shipFrom?: AddressWithContactInfoPOJO;
  shipTo?: AddressWithContactInfoPOJO;
  shipDateTime: DateTimeZonePOJO | Date | string;
  contents: readonly SalesOrderPackageItemPOJO[];
  notifyBuyer?: boolean;
  fulfillmentCost?: ChargePOJO;
  insuranceCost?: ChargePOJO;
}


export class SalesOrderShipment extends ShipmentIdentifierBase implements ISalesOrderShipment {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      salesOrder: SalesOrderIdentifier[_internal].schema.unknown(true).required(),
      carrierCode: Joi.string(),
      carrierServiceCode: Joi.string(),
      shipFrom: AddressWithContactInfo[_internal].schema,
      shipTo: AddressWithContactInfo[_internal].schema,
      shipDateTime: DateTimeZone[_internal].schema.required(),
      contents: Joi.array().min(1).items(SalesOrderPackageItem[_internal].schema).required(),
      notifyBuyer: Joi.boolean().optional(),
      fulfillmentCost: Charge[_internal].schema.optional(),
      insuranceCost: Charge[_internal].schema.optional(),
    }),
  };

  public readonly trackingURL?: URL;
  public readonly salesOrder: SalesOrderIdentifier;
  public readonly carrierCode?: string;
  public readonly carrierServiceCode?: string;

  public readonly shipFrom?: AddressWithContactInfo;
  public readonly shipTo?: AddressWithContactInfo;
  public readonly shipDateTime: DateTimeZone;
  public readonly contents: readonly SalesOrderPackageItem[];
  public readonly notifyBuyer?: boolean;
  public readonly fulfillmentCost?: Charge;
  public readonly insuranceCost?: Charge;

  public constructor(pojo: SalesOrderShipmentPOJO) {
    super(pojo);

    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.salesOrder = new SalesOrderIdentifier(pojo.salesOrder);
    this.carrierCode = pojo.carrierCode;
    this.carrierServiceCode = pojo.carrierServiceCode;
    this.shipFrom = pojo.shipFrom && new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = pojo.shipTo && new AddressWithContactInfo(pojo.shipTo);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.contents = (pojo.contents || []).map((item) => new SalesOrderPackageItem(item));
    this.notifyBuyer = pojo.notifyBuyer;
    this.fulfillmentCost = pojo.fulfillmentCost ? new Charge(pojo.fulfillmentCost) : undefined;
    this.insuranceCost = pojo.insuranceCost ? new Charge(pojo.insuranceCost) : undefined;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
