import { DeliveryConfirmationIdentifierPOJO, AddressWithContactInfoPOJO, DateTimeZonePOJO, DeliveryServiceIdentifierPOJO, FulfillmentService, RateCriteria as IRateCriteria } from "../../../public";
import { AddressWithContactInfo, App, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { PackageRateCriteria, PackageRateCriteriaPOJO } from "./package-rate-criteria";
import { DeliveryConfirmation } from "../delivery-confirmation";


export interface RateCriteriaPOJO {
  deliveryService?: DeliveryServiceIdentifierPOJO | string;
  fulfillmentService?: FulfillmentService;
  shipDateTime: DateTimeZonePOJO | Date | string;
  deliveryDateTime?: DateTimeZonePOJO | Date | string;
  shipFrom: AddressWithContactInfoPOJO;
  shipTo: AddressWithContactInfoPOJO;
  returns?: { isReturn?: boolean };
  package: PackageRateCriteriaPOJO;
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO | string;
}


export class RateCriteria implements IRateCriteria {
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      shipDateTime: DateTimeZone[_internal].schema.required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      shipFrom: AddressWithContactInfo[_internal].schema.required(),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      returns: Joi.object({
        isReturn: Joi.boolean()
      }),
      package: PackageRateCriteria[_internal].schema.required(),
      deliveryConfirmation: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ),
    }),
  };

  public readonly deliveryService?: DeliveryService;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly shipDateTime: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly shipFrom: AddressWithContactInfo;
  public readonly shipTo: AddressWithContactInfo;
  public readonly totalInsuredValue?: MonetaryValue;
  public readonly package: PackageRateCriteria;
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  public readonly returns: {
    readonly isReturn: boolean;
  };

  public constructor(pojo: RateCriteriaPOJO, app: App) {
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipDateTime = new DateTimeZone(pojo.shipDateTime);
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.shipFrom = new AddressWithContactInfo(pojo.shipFrom);
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.package = new PackageRateCriteria(pojo.package, app);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };


    // Make this object immutable
    hideAndFreeze(this);
  }
}
