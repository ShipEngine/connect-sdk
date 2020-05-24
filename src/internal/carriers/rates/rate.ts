import { ErrorCode, FulfillmentService, Rate as IRate, RatePOJO } from "../../../public";
import { App, calculateTotalCharges, Charge, createNotes, DateTimeZone, DefinitionIdentifier, error, hideAndFreeze, Joi, MonetaryValue, Note, TimeRange, _internal } from "../../common";
import { DeliveryService } from "../delivery-service";
import { RatePackage } from "./rate-package";

export class Rate implements IRate {
  public static readonly [_internal] = {
    label: "rate",
    schema: Joi.object({
      deliveryService: DefinitionIdentifier[_internal].schema.unknown(true).required(),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      shipDateTime: DateTimeZone[_internal].schema,
      deliveryDateTime: DateTimeZone[_internal].schema,
      minimumDeliveryDays: Joi.number().integer().min(0),
      maximumDeliveryDays: Joi.number().integer().min(0),
      deliveryWindow: TimeRange[_internal].schema,
      zone: Joi.number().integer().min(1),
      isNegotiatedRate: Joi.boolean(),
      isGuaranteed: Joi.boolean(),
      isTrackable: Joi.boolean(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      packages: Joi.array().min(1).items(RatePackage[_internal].schema).required(),
    }),
  };

  public readonly deliveryService: DeliveryService;
  public readonly fulfillmentService?: FulfillmentService;
  public readonly shipDateTime?: DateTimeZone;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly minimumDeliveryDays?: number;
  public readonly maximumDeliveryDays?: number;
  public readonly deliveryWindow?: TimeRange;
  public readonly zone?: number;
  public readonly isNegotiatedRate: boolean;
  public readonly isGuaranteed: boolean;
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
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipDateTime = pojo.shipDateTime ? new DateTimeZone(pojo.shipDateTime) : undefined;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.minimumDeliveryDays = pojo.minimumDeliveryDays;
    this.maximumDeliveryDays = pojo.maximumDeliveryDays;
    this.deliveryWindow = pojo.deliveryWindow && new TimeRange(pojo.deliveryWindow);
    this.zone = pojo.zone;
    this.isNegotiatedRate = pojo.isNegotiatedRate || false;
    this.isGuaranteed = pojo.isGuaranteed || false;
    this.isTrackable = pojo.isTrackable || false;
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.notes = createNotes(pojo.notes);
    this.packages = pojo.packages.map((parcel) => new RatePackage(parcel, app));

    let { minimumDeliveryDays, maximumDeliveryDays } = this;
    if (minimumDeliveryDays !== undefined
    && maximumDeliveryDays !== undefined
    && minimumDeliveryDays > maximumDeliveryDays) {
      throw error(ErrorCode.Validation,
        "Invalid delivery time range: minimumDeliveryDays must be less than or equal to maximumDeliveryDays");
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}
