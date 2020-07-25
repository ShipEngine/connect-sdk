import { BilledParty, Country, NewShipment as INewShipment, NewShipmentPOJO } from "../../../public";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { NewPackage } from "../packages/new-package";
import { calculateTotalInsuranceAmount } from "../utils";
import { ShipmentIdentifier } from "./shipment-identifier";

export class NewShipment implements INewShipment {
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryService: DefinitionIdentifier[_internal].schema.unknown(true).required(),
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returnTo: AddressWithContactInfo[_internal].schema,
      shipDateTime: DateTimeZone[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean(),
        rmaNumber: Joi.string().trim().singleLine().allow("").max(100)
      }),
      billing: Joi.object({
        dutiesPaidBy: Joi.string().enum(BilledParty),
        deliveryPaidBy: Joi.string().enum(BilledParty),
        account: Joi.string().trim().singleLine().allow("").max(100)
          .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() })
          .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() }),
        postalCode: Joi.string().trim().singleLine().allow("").max(100)
          .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() })
          .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.string().min(1).required() }),
        country: Joi.string().enum(Country)
          .when("dutiesPaidBy", { is: BilledParty.ThirdParty, then: Joi.required() })
          .when("deliveryPaidBy", { is: BilledParty.ThirdParty, then: Joi.required() }),
      }),
      packages: Joi.array().min(1).items(NewPackage[_internal].schema).required(),
    }),
  };

  public readonly deliveryService: DeliveryService;
  public readonly shipFrom: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly returnTo: AddressWithContactInfo;
  public readonly shipDateTime: DateTimeZone;
  public readonly totalInsuredValue: MonetaryValue;

  public get isNonMachinable(): boolean {
    return this.packages.some((pkg) => pkg.isNonMachinable);
  }

  public readonly returns: {
    readonly isReturn: boolean;
    readonly rmaNumber: string;
  };

  public readonly billing: {
    readonly dutiesPaidBy: BilledParty;
    readonly deliveryPaidBy: BilledParty;
    readonly account: string;
    readonly postalCode: string;
    readonly country?: Country;
  };

  public readonly packages: ReadonlyArray<NewPackage>;

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

    // If there is no billing info, then the sender is billed by default
    let billing = pojo.billing || {};
    this.billing = {
      dutiesPaidBy: billing.dutiesPaidBy || BilledParty.Sender,
      deliveryPaidBy: billing.deliveryPaidBy || BilledParty.Sender,
      account: billing.account || "",
      postalCode: billing.postalCode || "",
      country: billing.country
    };

    this.packages = pojo.packages.map((parcel) => new NewPackage(parcel, app));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
