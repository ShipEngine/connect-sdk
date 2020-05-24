import { Charge as ICharge, ChargePOJO, ChargeType, ErrorCode, ShipEngineError } from "../../public";
import { error } from "./errors";
import { MonetaryValue } from "./measures/monetary-value";
import { createNotes, Note } from "./note";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";


/**
 * Calculates the total of an array of charges
 */
export function calculateTotalCharges(charges: ReadonlyArray<Charge>): MonetaryValue {
  try {
    let insuredValues = charges.map((charge) => charge.amount);
    return MonetaryValue.sum(insuredValues);
  }
  catch (originalError) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as ShipEngineError).code === ErrorCode.CurrencyMismatch) {
      throw error(
        ErrorCode.CurrencyMismatch,
        "All charges must be in the same currency.",
        { originalError }
      );
    }

    throw originalError;
  }
}


/**
 * An itemized charge or credit for a shipment or sales order
 */
export class Charge implements ICharge {
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

  public readonly name: string;
  public readonly description: string;
  public readonly code: string;
  public readonly type: ChargeType;
  public readonly amount: MonetaryValue;
  public readonly notes: ReadonlyArray<Note>;

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
