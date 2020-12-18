import { DeliveryConfirmationIdentifierPOJO, AddressWithContactInfoPOJO, DateTimeZonePOJO, DeliveryServiceIdentifierPOJO, FulfillmentService, RateCriteria as IRateCriteria } from "../../../public";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { calculateTotalInsuranceAmount } from "../utils";
import { PackageRateCriteria, PackageRateCriteriaPOJO } from "./package-rate-criteria";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { ShippingOptions } from "../shipping-options";
import { ShippingOptions as ShippingOptionsPOJO} from "../../../public"

export interface RateCriteriaPOJO {
  deliveryService?: DeliveryServiceIdentifierPOJO | string;
  fulfillmentService?: FulfillmentService;
  shipDateTime: DateTimeZonePOJO | Date | string;
  deliveryDateTime?: DateTimeZonePOJO | Date | string;
  shipFrom: AddressWithContactInfoPOJO;
  shipTo: AddressWithContactInfoPOJO;
  returns?: { isReturn?: boolean };
  packages: readonly PackageRateCriteriaPOJO[];
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO | string;
  shippingOptions: ShippingOptionsPOJO;
}


export class RateCriteria implements IRateCriteria {
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string().allow("").optional()
      ).optional(),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean()
      }),
      packages: Joi.array().min(1).items(PackageRateCriteria[_internal].schema).required(),
      deliveryConfirmation: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ),
      shippingOptions: ShippingOptions[_internal].schema

    }),
  };

  public readonly deliveryService?: DeliveryService;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly shipDateTime: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly shipFrom: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly totalInsuredValue?: MonetaryValue;
  public readonly packages: readonly PackageRateCriteria[];
  public readonly deliveryConfirmation?: DeliveryConfirmation;
  public readonly shippingOptions?: ShippingOptions;

  public readonly returns: {
    readonly isReturn: boolean;
  };

  public get package(): PackageRateCriteria {
    return this.packages[0];
  }

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    if (pojo.deliveryService) {
      this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);
    }

    this.fulfillmentService = pojo.fulfillmentService;
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    // If there's no return info, then the shipment is not a return
    const returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };

    this.packages = pojo.packages.map((parcel) => new PackageRateCriteria(parcel, app));
    this.totalInsuredValue = calculateTotalInsuranceAmount(this.packages);

    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    this.shippingOptions = pojo.shippingOptions ? new ShippingOptions(pojo.shippingOptions) : undefined;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
