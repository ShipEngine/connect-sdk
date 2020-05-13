import * as currency from "currency.js";
import { Currency } from "../../enums";
import { error, ErrorCode } from "../../errors";
import { hideAndFreeze, Joi, _internal } from "../../internal";

/**
 * A monetary value in a supported currency
 */
export interface MonetaryValuePOJO {
  /**
   * The amount of this value.
   *
   * NOTE: We recommend using a string value to avoid floating point rounding issues.
   */
  value: number | string;

  /**
   * The currency that the value represents.
   */
  currency: Currency;
}


/**
 * A monetary value in a supported currency
 */
export class MonetaryValue {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "monetary value",
    schema: Joi.object({
      value: Joi.alternatives(Joi.number().min(0), Joi.string().money()).required(),
      currency: Joi.string().enum(Currency).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The amount of this value. Represented as a string to avoid floating
   * point rounding issues. You must parse this string into a type
   * appropriate for financial and monetary calculations.
   */
  public readonly value: string;

  /**
   * The currency that the value represents.
   */
  public readonly currency: Currency;

  //#endregion

  public constructor(pojo: MonetaryValuePOJO) {
    this.value = currency(pojo.value).toString();
    this.currency = pojo.currency;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the sum total of all the given monetary values
   */
  public static sum(charges: MonetaryValue[]): MonetaryValue {
    let uniqueCurrencies = new Set<Currency>();
    let total = currency(0);

    for (let charge of charges) {
      let value = currency(charge.value);

      if (value.intValue > 0) {
        total = total.add(charge.value);
        uniqueCurrencies.add(charge.currency);
      }
    }

    if (uniqueCurrencies.size > 1) {
      let currencies = [...uniqueCurrencies];
      throw error(
        ErrorCode.CurrencyMismatch,
        `Currency mistmatch: (${currencies.join(", ")}). All charges must be in the same currency.`,
        { currencies }
      );
    }

    return new MonetaryValue({
      currency: [...uniqueCurrencies][0] || Currency.UnitedStatesDollar,
      value: total.toString(),
    });
  }
}

// Prevent modifications to the class
hideAndFreeze(MonetaryValue);
