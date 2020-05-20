import { Charge, DateTimeZone, ErrorCode, MonetaryValue, Note, TimeRange } from "../../common";
import { App, calculateTotalCharges, createNotes, DefinitionIdentifier, error, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { DeliveryService } from "../delivery-service";
import { FulfillmentService } from "../fulfillment-service";
import { RatePackage } from "./rate-package";
import { RatePOJO } from "./rate-pojo";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export class Rate {
  //#region Private/Internal Fields

  /** @internal */
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

  //#endregion
  //#region Public Fields

  /**
   * The delivery service this rate is for
   */
  public readonly deliveryService: DeliveryService;

  /**
   * The well-known third-party carrier service that will be used to fulfill the shipment
   */
  public readonly fulfillmentService?: FulfillmentService;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  public readonly shipDateTime?: DateTimeZone;

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: DateTimeZone;

  /**
   * The minimum number of days delivery will take
   */
  public readonly minimumDeliveryDays?: number;

  /**
   * The maximum number of days delivery will take
   */
  public readonly maximumDeliveryDays?: number;

  /**
   * The expected delivery window
   */
  public readonly deliveryWindow?: TimeRange;

  /**
   * Certain carriers base their rates off of zone numbers that vary based on the origin and destination
   *
   * @see https://stamps.custhelp.com/app/answers/detail/a_id/6118/~/all-about-usps-postal-zones
   */
  public readonly zone?: number;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  public readonly isNegotiatedRate: boolean;

  /**
   * Indicates whether the carrier guarantees delivery by the `deliveryDateTime`
   */
  public readonly isGuaranteed: boolean;

  /**
   * Indicates whether tracking numbers are provided
   */
  public readonly isTrackable: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this rate
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<RatePackage>;

  /**
   * Returns the first package in the `packages` array.
   * Useful for carriers that only support single-piece shipments.
   */
  public get package(): RatePackage {
    return this.packages[0];
  }

  //#endregion

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

// Prevent modifications to the class
hideAndFreeze(Rate);
