import { Rate as RatePOJO } from "../../../public";
import { App, calculateTotalCharges, Charge, DateTimeZone, DefinitionIdentifier, hideAndFreeze, Joi, MonetaryValue, Note, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { RatePackage } from "./rate-package";
import { DeliveryConfirmation } from "../delivery-confirmation";

export class Rate {
  public static readonly [_internal] = {
    label: "rate",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string().allow("").optional()
      ).optional(),
      shipDateTime: DateTimeZone[_internal].schema,
      deliveryDateTime: DateTimeZone[_internal].schema,
      isNegotiatedRate: Joi.boolean(),
      isTrackable: Joi.boolean(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      packages: Joi.array().items(RatePackage[_internal].schema).optional(),
      deliveryConfirmation: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      )
    }),
  };

  public readonly deliveryService: DeliveryService;
  public readonly shipDateTime?: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly isNegotiatedRate: boolean;
  public readonly isTrackable: boolean;
  public readonly charges: readonly Charge[];
  public readonly totalAmount: MonetaryValue;
  public readonly notes: readonly Note[];
  public readonly packages: readonly RatePackage[];
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  public get package(): RatePackage | undefined {
    return this.packages[0];
  }

  public constructor(pojo: RatePOJO, app: App) {
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryService, DeliveryService);

    this.shipDateTime = pojo.shipDateTime ? new DateTimeZone(pojo.shipDateTime) : undefined;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.isNegotiatedRate = pojo.isNegotiatedRate || false;
    this.isTrackable = pojo.isTrackable || false;
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.notes = pojo.notes || [];
    this.packages =
      pojo.packages ? pojo.packages.map((parcel) => new RatePackage(parcel, app)) : [];
    this.deliveryConfirmation =
      app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
