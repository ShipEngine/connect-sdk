import { FulfillmentService } from "../../../enums";
import { RatePOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { MonetaryValue } from "../../common";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryService } from "../delivery-service";
import { Packaging } from "../packaging";
import { ShippingCharge } from "../shipping-charge";
import { calculateTotalCharges } from "../utils";

/**
 * A quoted shipping rate based on the specified rate criteria
 */
export class Rate {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "rate",
    schema: Joi.object({
      deliveryServiceID: Joi.string().uuid().required(),
      packagingID: Joi.string().uuid().required(),
      deliveryConfirmationID: Joi.string().uuid(),
      fulfillmentService: Joi.string().enum(FulfillmentService),
      shipDateTime: Joi.date(),
      deliveryDateTime: Joi.date(),
      isNegotiatedRate: Joi.boolean(),
      charges: Joi.array().min(1).items(ShippingCharge[_internal].schema).required(),
      notes: Joi.string().allow("").max(5000),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The delivery service this rate is for
   */
  public readonly deliveryService: DeliveryService;

  /**
   * The packaging this rate is for
   */
  public readonly packaging: Packaging;

  /**
   * The delivery confirmation included in this rate
   */
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The well-known third-party carrier service that will be used to fulfill the shipment
   */
  public readonly fulfillmentService?: FulfillmentService;

  /**
   * The date/time that the package is expected to ship.
   * This is not guaranteed to be in the future.
   */
  public readonly shipDateTime?: Date;

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: Date;

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
  public readonly notes: string;

  //#endregion

  public constructor(pojo: RatePOJO, app: App) {
    this.deliveryService = app[_internal].references.lookup(pojo.deliveryServiceID, DeliveryService);
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmationID, DeliveryConfirmation);
    this.fulfillmentService = pojo.fulfillmentService;
    this.shipDateTime = pojo.shipDateTime;
    this.deliveryDateTime = pojo.deliveryDateTime;
    this.isNegotiatedRate = pojo.isNegotiatedRate || false;
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.notes = pojo.notes || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Rate);
