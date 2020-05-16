import { MonetaryValue, Note } from "../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../internal";
import { ShippingChargeType } from "./enums";
import { ShippingChargePOJO } from "./shipping-charge-pojo";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export class ShippingCharge {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipping charge",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      code: Joi.string().trim().singleLine().min(1).max(100),
      type: Joi.string().enum(ShippingChargeType).required(),
      amount: MonetaryValue[_internal].schema.required(),
      notes: Note[_internal].notesSchema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  public readonly name: string;

  /**
   * The carrier's description of the charge, not specific to the user
   */
  public readonly description: string;

  /**
   * The carrier's code for this charge
   */
  public readonly code: string;

  /**
   * The type of charge
   */
  public readonly type: ShippingChargeType;

  /**
   * The amount of the charge
   */
  public readonly amount: MonetaryValue;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  public readonly notes: ReadonlyArray<Note>;

  //#endregion

  public constructor(pojo: ShippingChargePOJO) {
    this.name = pojo.name || "";
    this.description = pojo.description || "";
    this.code = pojo.code || "";
    this.type = pojo.type;
    this.amount = new MonetaryValue(pojo.amount);
    this.notes = createNotes(pojo.notes);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShippingCharge);
