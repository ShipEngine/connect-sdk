import { FulfillmentService, RateCriteria as IRateCriteria, RateCriteriaPOJO } from "../../../public";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { calculateTotalInsuranceAmount } from "../utils";
import { PackageRateCriteria } from "./package-rate-criteria";

export class RateCriteria implements IRateCriteria {
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryServices: Joi.array().items(DefinitionIdentifier[_internal].schema.unknown(true)),
      fulfillmentServices: Joi.array().items(Joi.string().enum(FulfillmentService)),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean(),
        outboundShipment: ShipmentIdentifier[_internal].schema.unknown(true),
      }),
      packages: Joi.array().min(1).items(PackageRateCriteria[_internal].schema).required(),
    }),
  };

  public readonly deliveryServices: ReadonlyArray<DeliveryService>;
  public readonly fulfillmentServices: ReadonlyArray<FulfillmentService>;
  public readonly shipDateTime: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly shipFrom: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly totalInsuredValue?: MonetaryValue;
  public readonly packages: ReadonlyArray<PackageRateCriteria>;
  public readonly returns: {
    readonly isReturn: boolean;
    readonly outboundShipment?: Readonly<ShipmentIdentifier>;
  };

  public get package(): PackageRateCriteria {
    return this.packages[0];
  }

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    this.deliveryServices = (pojo.deliveryServices || [])
      .map((id) => app[_internal].references.lookup(id, DeliveryService));
    this.fulfillmentServices = pojo.fulfillmentServices || [];
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
      outboundShipment: returns.outboundShipment && new ShipmentIdentifier(returns.outboundShipment),
    };

    this.packages = pojo.packages.map((parcel) => new PackageRateCriteria(parcel, app));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    // Make this object immutable
    hideAndFreeze(this);
    Object.freeze(this.returns.outboundShipment);
  }
}
