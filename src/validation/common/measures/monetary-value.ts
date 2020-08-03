import * as currency from "currency.js";
import { ErrorCode, MonetaryValue as IMonetaryValue, MonetaryValue as MonetaryValuePOJO } from "../../../definitions";
import { error } from "../errors";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

/**
 * A monetary value in a supported currency
 */
export class MonetaryValue implements IMonetaryValue {
  public static [_internal] = {
    label: "monetary value",
    schema: Joi.object({
      value: Joi.alternatives(Joi.number(), Joi.string().money()).required(),
      currency: Joi.string().required(),
    }),
  };

  public value: string;
  public currency: string;

  public constructor(pojo: MonetaryValuePOJO) {
    this.value = currency(pojo.value).toString();
    this.currency = pojo.currency;

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the sum total of all the given monetary values
   */
  public static sum(monetaryValues: MonetaryValue[]): MonetaryValue {
    let uniqueCurrencies = new Set<string>();
    let total = currency(0);

    for (let monetaryValue of monetaryValues) {
      let value = currency(monetaryValue.value);

      if (value.intValue > 0) {
        total = total.add(monetaryValue.value);
        uniqueCurrencies.add(monetaryValue.currency);
      }
    }

    if (uniqueCurrencies.size > 1) {
      let currencies = [...uniqueCurrencies];
      throw error(
        ErrorCode.CurrencyMismatch,
        `Currency mismatch: ${currencies.join(", ")}. All monetary values must be in the same currency.`,
        { currencies }
      );
    }

    return new MonetaryValue({
      currency: [...uniqueCurrencies][0] || "usd",
      value: total.toString(),
    });
  }
}
