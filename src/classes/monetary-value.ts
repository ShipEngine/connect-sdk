// tslint:disable: max-classes-per-file
import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import * as currency from "currency.js";
import { assert } from "../assert";
import { Currency } from "../enums";
import { ErrorCode } from "../errors";
import { MonetaryValuePOJO } from "../pojos";

const moneyValue = /^\d+(\.\d+)?$/;
moneyValue.example = "##.##";


/**
 * A monetary value in a supported currency
 */
export class MonetaryValue {
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

  public constructor(pojo: MonetaryValuePOJO) {
    assert.type.object(pojo, "monetary value");

    let value = typeof pojo.value === "number"
      ? assert.number.nonNegative(pojo.value, "monetary value")
      : assert.string.pattern(pojo.value, moneyValue, "monetary value");

    this.value = currency(value).toString();
    this.currency = assert.string.enum(pojo.currency, Currency, "currency");

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
      throw ono(
        { code: ErrorCode.CurrencyMismatch, currencies },
        `All charges must be in the same currency. These charges include ${humanize.list(currencies)}`
      );
    }

    return new MonetaryValue({
      currency: [...uniqueCurrencies][0] || Currency.UnitedStatesDollar,
      value: total.toString(),
    });
  }
}
