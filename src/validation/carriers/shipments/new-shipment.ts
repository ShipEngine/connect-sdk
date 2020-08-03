import { BilledParty, Country, NewShipment as INewShipment, NewShipment as NewShipmentPOJO } from "../../../definitions";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { NewPackage } from "../packages/new-package";
import { calculateTotalInsuranceAmount } from "../utils";
import { ShipmentIdentifier } from "./shipment-identifier";

export class NewShipment implements INewShipment {
  public static [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returnTo: AddressWithContactInfo[_internal].schema,
      shipDateTime: DateTimeZone[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean(),
        rmaNumber: Joi.string().trim().singleLine().allow("").max(100)
      }),
      packages: Joi.array().min(1).items(NewPackage[_internal].schema).required(),
    }),
  };

  public deliveryService: DeliveryService;
  public shipFrom: AddressWithContactInfo;
  public shipTo: AddressWithContactInfo;
  public returnTo: AddressWithContactInfo;
  public shipDateTime: DateTimeZone;
  public totalInsuredValue: MonetaryValue;

  public get isNonMachinable(): boolean {
    return this.packages.some((pkg) => pkg.isNonMachinable);
  }

  public returns: {
    isReturn: boolean;
    rmaNumber: string;
  };

  public packages: Array<NewPackage>;

  public get package(): NewPackage {
    return this.packages[0];
  }

  public constructor(pojo: NewShipmentPOJO, app: App) {
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.returnTo = pojo.returnTo ? new AddressWithContactInfo(pojo.returnTo) : this.shipFrom;
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
      rmaNumber: returns.rmaNumber || ""
    };

    this.packages = pojo.packages.map((parcel) => new NewPackage(parcel, app));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
