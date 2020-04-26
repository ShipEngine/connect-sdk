// tslint:disable: max-classes-per-file
import * as currency from "currency.js";
import { Currency } from "../../enums";
import { ErrorCode, ipaasError } from "../../errors";
import { MonetaryValuePOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * A monetary value in a supported currency
 */
export class MonetaryValue {
  //#region Class Fields

  public static readonly label = "monetary value";

  /** @internal */
  public static readonly schema = Joi.object({
    value: Joi.alternatives(Joi.number().min(0), Joi.string().money()).required(),
    currency: Joi.string().enum(Currency).required(),
  });

  //#endregion
  //#region Instance Fields

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

    // Prevent modifications after validation
    Object.freeze(this);
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
      throw ipaasError(
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
