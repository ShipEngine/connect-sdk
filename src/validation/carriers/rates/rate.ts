import {  Rate as IRate, Rate as RatePOJO } from "../../../definitions";
import { App, calculateTotalCharges, Charge, createNotes, DateTimeZone, DefinitionIdentifier, error, hideAndFreeze, Joi, MonetaryValue, Note, TimeRange, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { RatePackage } from "./rate-package";

export class Rate implements IRate {
  public static [_internal] = {
    label: "rate",
    schema: Joi.object({
      deliveryService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      shipDateTime: DateTimeZone[_internal].schema,
      deliveryDateTime: DateTimeZone[_internal].schema,
      isNegotiatedRate: Joi.boolean(),
      isTrackable: Joi.boolean(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      packages: Joi.array().min(1).items(RatePackage[_internal].schema).required(),
    }),
  };

  public deliveryService: DeliveryService;
  public shipDateTime?: DateTimeZone;
  public deliveryDateTime?: DateTimeZone;
  public isNegotiatedRate: boolean;
  public isTrackable: boolean;
  public charges: Array<Charge>;
  public totalAmount: MonetaryValue;
  public notes: Array<Note>;
  public packages: Array<RatePackage>;

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
