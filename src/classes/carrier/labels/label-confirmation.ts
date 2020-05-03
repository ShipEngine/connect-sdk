import { LabelConfirmationPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { MonetaryValue } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";
import { ShipmentConfirmation } from "../shipments/shipment-confirmation";
import { ShippingCharge } from "../shipping-charge";
import { calculateTotalCharges } from "../utils";

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
      charges: Joi.array().min(1).items(ShippingCharge[_internal].schema).required(),
      shipment: ShipmentConfirmation[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's confirmation ID for this transaction
   */
  public readonly confirmationID: string;

  /**
   * The breakdown of charges for this label.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this label.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * Confirmation details about the shipment and its packages
   */
  public readonly shipment: ShipmentConfirmation;

  //#endregion

  public constructor(pojo: LabelConfirmationPOJO) {
    validate(pojo, LabelConfirmation);

    this.confirmationID = pojo.confirmationID || "";
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.shipment = new ShipmentConfirmation(pojo.shipment);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(LabelConfirmation);
