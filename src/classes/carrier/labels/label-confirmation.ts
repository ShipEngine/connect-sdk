import { LabelConfirmationPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { MonetaryValue } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";
import { calculateTotalCharges } from "../utils";
import { Label } from "./label";
import { ShippingCharge } from "./shipping-charge";

/**
 * Confirms the successful creation of a shipping label
 */
export class LabelConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label confirmation",
    schema: Joi.object({
      confirmationID: Joi.string().trim().singleLine().allow("").max(100),
      shipmentTrackingNumber: Joi.string().trim().singleLine().allow("").max(100),
      estimatedDeliveryDateTime: Joi.date(),
      charges: Joi.array().min(1).items(ShippingCharge[_internal].schema).required(),
      labels: Joi.array().min(1).items(Label[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's confirmation ID for this transaction
   */
  public readonly confirmationID: string;

  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the label tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  public readonly shipmentTrackingNumber: string;

  /**
   * The estimated date and time for when the shipment will be delivered.
   */
  public readonly estimatedDeliveryDateTime?: Date;

  /**
   * The breakdown of charges in the total shipping cost for this label.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this label.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * The shipping labels that were created
   */
  public readonly labels: ReadonlyArray<Label>;

  //#endregion

  public constructor(pojo: LabelConfirmationPOJO) {
    validate(pojo, LabelConfirmation);

    this.confirmationID = pojo.confirmationID || "";
    this.shipmentTrackingNumber = pojo.shipmentTrackingNumber || "";
    this.estimatedDeliveryDateTime = pojo.estimatedDeliveryDateTime;
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.labels = pojo.labels.map((label) => new Label(label));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(LabelConfirmation);
