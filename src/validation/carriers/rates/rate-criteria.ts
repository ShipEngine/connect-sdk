import { RateCriteria as IRateCriteria, RateCriteria as RateCriteriaPOJO } from "../../../definitions";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { calculateTotalInsuranceAmount } from "../utils";
import { PackageRateCriteria } from "./package-rate-criteria";

export class RateCriteria implements IRateCriteria {
  public static [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean()
      }),
      packages: Joi.array().min(1).items(PackageRateCriteria[_internal].schema).required(),
    }),
  };

  public deliveryService?: DeliveryService;
  public shipDateTime: DateTimeZone;
  public deliveryDateTime?: DateTimeZone;
  public shipFrom: AddressWithContactInfo;
  public shipTo: AddressWithContactInfo;
  public totalInsuredValue?: MonetaryValue;
  public packages: Array<PackageRateCriteria>;
  public returns: {
    isReturn: boolean;
  };

  public get package(): PackageRateCriteria {
    return this.packages[0];
  }

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };

    this.packages = pojo.packages.map((parcel) => new PackageRateCriteria(parcel, app));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
