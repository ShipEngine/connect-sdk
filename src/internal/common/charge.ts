import { AppError, Charge as ICharge, ChargePOJO, ChargeType } from "../../public";
import { error, SystemErrorCode } from "./errors";
import { MonetaryValue } from "./measures/monetary-value";
import { hideAndFreeze, _internal } from "./utils";
import { Joi } from "./validation";


/**
 * Calculates the total of an array of charges
 */
export function calculateTotalCharges(charges: readonly Charge[]): MonetaryValue {
  try {
    const insuredValues = charges.map((charge) => charge.amount);
    return MonetaryValue.sum(insuredValues);
  }
  catch (originalError: unknown) {
    // Check for a currency mismatch, and throw a more specific error message
    if ((originalError as AppError).code === SystemErrorCode.CurrencyMismatch) {
      throw error(
        SystemErrorCode.CurrencyMismatch,
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
      name: Joi.string().singleLine().allow(""),
      type: Joi.string().enum(ChargeType).required(),
      amount: MonetaryValue[_internal].schema.required(),
    }),
  };

  public readonly name: string;
  public readonly type: ChargeType;
  public readonly amount: MonetaryValue;

  public constructor(pojo: ChargePOJO) {
    this.name = pojo.name || "";
    this.type = pojo.type;
    this.amount = new MonetaryValue(pojo.amount);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
