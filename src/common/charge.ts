import { ChargeType } from "./enums";
import { createNotes } from "./internal/create-note";
import { hideAndFreeze, _internal } from "./internal/utils";
import { Joi } from "./internal/validation";
import { MonetaryValue, MonetaryValuePOJO } from "./measures/monetary-value";
import { Note, NotePOJO } from "./note";

/**
 * An itemized charge or credit for a shipment or sales order
 */
export interface ChargePOJO {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  name?: string;

  /**
   * The carrier's description of the charge, not specific to the user
   */
  description?: string;

  /**
   * The carrier's code for this charge
   */
  code?: string;

  /**
   * The type of charge
   */
  type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  amount: MonetaryValuePOJO;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  notes?: string | ReadonlyArray<string | NotePOJO>;
}


/**
 * An itemized charge or credit for a shipment or sales order
 */
export class Charge {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "charge",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      code: Joi.string().trim().singleLine().allow("").max(100),
      type: Joi.string().enum(ChargeType).required(),
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
  public readonly type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  public readonly amount: MonetaryValue;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  public readonly notes: ReadonlyArray<Note>;

  //#endregion

  public constructor(pojo: ChargePOJO) {
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
hideAndFreeze(Charge);
