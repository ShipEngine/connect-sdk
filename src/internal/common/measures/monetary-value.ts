import * as currency from "currency.js";
import { MonetaryValue as IMonetaryValue, MonetaryValuePOJO } from "../../../public";
import { error, SystemErrorCode } from "../errors";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

/**
 * A monetary value in a supported currency
 */
export class MonetaryValue implements IMonetaryValue {
  public static readonly [_internal] = {
    label: "monetary value",
    schema: Joi.object({
      value: Joi.alternatives(Joi.number()).required(),
      currency: Joi.string().required(),
    }),
  };

  public readonly value: number;
  public readonly currency: string;

  public constructor(pojo: MonetaryValuePOJO) {
    this.value = currency(pojo.value).value;
    this.currency = pojo.currency;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the sum total of all the given monetary values
   */
  public static sum(monetaryValues: MonetaryValue[]): MonetaryValue {
    const uniqueCurrencies = new Set<string>();
    let total = currency(0);

    for (const monetaryValue of monetaryValues) {
      const value = currency(monetaryValue.value);

      if (value.intValue > 0) {
        total = total.add(monetaryValue.value);
        uniqueCurrencies.add(monetaryValue.currency);
      }
    }

    if (uniqueCurrencies.size > 1) {
      const currencies = [...uniqueCurrencies];
      throw error(
        SystemErrorCode.CurrencyMismatch,
        `Currency mismatch: ${currencies.join(", ")}. All monetary values must be in the same currency.`,
        { currencies }
      );
    }

    return new MonetaryValue({
      currency: [...uniqueCurrencies][0] || "usd",
      value: total.value,
    });
  }
}
