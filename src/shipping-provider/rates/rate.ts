import { assert } from "../../assert";
import { RateConfig } from "../../config";
import { ShippingProviderApp } from "../app";
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
  public readonly deliveryService?: DeliveryService;

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
   * Indicates whether this rate is based on pre-negotiated terms
   */
  public readonly isNegotiatedRate: boolean;

  /**
   * Additional information regarding this rate quote, such as limitations or restrictions
   */
  public readonly notes: ReadonlyArray<string>;

  /**
   * Creates a RateCriteria object from a config object
   */
  public constructor(app: ShippingProviderApp, config: RateConfig) {
    assert.type.object(config, "rate");
    this.deliveryService = config.deliveryServiceID === undefined ? undefined
      : app.getDeliveryService(config.deliveryServiceID);
    this.deliveryConfirmation = config.deliveryConfirmationID === undefined ? undefined
      : app.getDeliveryConfirmation(config.deliveryConfirmationID);
    this.estimatedDeliveryDateTime = config.estimatedDeliveryDateTime
      && assert.type.date(config.estimatedDeliveryDateTime, "estimated delivery date/time");
    this.charges = assert.array.nonEmpty(config.charges, "rate charges")
      .map((charge) => new ShippingCharge(charge));
    this.isNegotiatedRate = assert.type.boolean(config.isNegotiatedRate, "isNegotiatedRate flag", false);
    this.notes = assert.array(typeof config.notes === "string" ? [config.notes] : config.notes, "notes", [])
      .map((note) => assert.string.nonWhitespace(note, "notes"));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.charges);
    Object.freeze(this.notes);
  }
}
