import { ErrorCode, FulfillmentService, Rate as IRate, RatePOJO } from "../../../public";
import { App, calculateTotalCharges, Charge, createNotes, DateTimeZone, DefinitionIdentifier, error, hideAndFreeze, Joi, MonetaryValue, Note, TimeRange, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { RatePackage } from "./rate-package";

export class Rate implements IRate {
  public static readonly [_internal] = {
    label: "rate",
    schema: Joi.object({
      deliveryService: DefinitionIdentifier[_internal].schema.unknown(true).required(),
      shipDateTime: DateTimeZone[_internal].schema,
      deliveryDateTime: DateTimeZone[_internal].schema,
      isNegotiatedRate: Joi.boolean(),
      isTrackable: Joi.boolean(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      packages: Joi.array().min(1).items(RatePackage[_internal].schema).required(),
    }),
  };

  public readonly deliveryService: DeliveryService;
  public readonly shipDateTime?: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly isNegotiatedRate: boolean;
  public readonly isTrackable: boolean;
  public readonly charges: ReadonlyArray<Charge>;
  public readonly totalAmount: MonetaryValue;
  public readonly notes: ReadonlyArray<Note>;
  public readonly packages: ReadonlyArray<RatePackage>;

  public get package(): RatePackage {
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
    this.notes = createNotes(pojo.notes);
    this.packages = pojo.packages.map((parcel) => new RatePackage(parcel, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
