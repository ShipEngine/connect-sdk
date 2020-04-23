import { assert } from "../../../assert";
import { RatePOJO } from "../../../pojos";
import { App } from "../../app";
import { MonetaryValue } from "../../monetary-value";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryService } from "../delivery-service";
import { ShippingCharge } from "../labels/shipping-charge";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export class Rate {
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
   * Indicates whether this rate is based on pre-negotiated terms
   */
  public readonly isNegotiatedRate: boolean;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  public readonly notes: ReadonlyArray<string>;

  public constructor(app: App, pojo: RatePOJO) {
    assert.type.object(pojo, "rate");
    this.deliveryService = app._references.lookup(pojo.deliveryServiceID, DeliveryService, "delivery service");
    this.deliveryConfirmation = app._references.get(pojo.deliveryConfirmationID, DeliveryConfirmation, "delivery confirmation");
    this.estimatedDeliveryDateTime = pojo.estimatedDeliveryDateTime
      && assert.type.date(pojo.estimatedDeliveryDateTime, "estimated delivery date/time");
    this.charges = assert.array.nonEmpty(pojo.charges, "rate charges")
      .map((charge) => new ShippingCharge(charge));
    this.totalAmount = MonetaryValue.sum(this.charges.map((charge) => charge.amount));
    this.isNegotiatedRate = assert.type.boolean(pojo.isNegotiatedRate, "isNegotiatedRate flag", false);
    this.notes = assert.array(typeof pojo.notes === "string" ? [pojo.notes] : pojo.notes, "notes", [])
      .map((note) => assert.string.nonWhitespace(note, "notes"));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.charges);
    Object.freeze(this.notes);
  }
}
