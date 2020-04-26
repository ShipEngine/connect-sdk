import { RatePOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { App, MonetaryValue } from "../../common";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryService } from "../delivery-service";
import { ShippingCharge } from "../labels/shipping-charge";
import { calculateTotalCharges } from "../utils";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export class Rate {
  //#region Class Fields

  public static readonly label = "rate";

  /** @internal */
  public static readonly schema = Joi.object({
    deliveryServiceID: Joi.string().uuid().required(),
    deliveryConfirmationID: Joi.string().uuid(),
    shipDateTime: Joi.date(),
    estimatedDeliveryDateTime: Joi.date(),
    isNegotiatedRate: Joi.boolean(),
    charges: Joi.array().min(1).items(ShippingCharge.schema).required(),
    notes: Joi.alternatives(
      Joi.string().allow("").max(5000),
      Joi.array().items(Joi.string().allow("").max(5000)),
    )
  });

  //#endregion
  //#region Instance Fields

  /**
   * The ID of the delivery service this rate is for
   */
  public readonly deliveryService: DeliveryService;

  /**
   * The ID of the delivery confirmation included in this rate
   */
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  public readonly shipDateTime?: Date;

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly estimatedDeliveryDateTime?: Date;

  /**
   * Indicates whether this rate is based on pre-negotiated terms
   */
  public readonly isNegotiatedRate: boolean;

  /**
   * The breakdown of charges for this rate.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this rate.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  public readonly notes: ReadonlyArray<string>;

  //#endregion

  public constructor(pojo: RatePOJO, app: App) {
    this.deliveryService = app._references.lookup(pojo.deliveryServiceID, DeliveryService);
    this.deliveryConfirmation = app._references.get(pojo.deliveryConfirmationID, DeliveryConfirmation);
    this.shipDateTime = pojo.shipDateTime;
    this.estimatedDeliveryDateTime = pojo.estimatedDeliveryDateTime;
    this.isNegotiatedRate = pojo.isNegotiatedRate || false;
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.notes = pojo.notes ? typeof pojo.notes === "string" ? [pojo.notes] : pojo.notes : [];

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.charges);
    Object.freeze(this.notes);
  }
}
