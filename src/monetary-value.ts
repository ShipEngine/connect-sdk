// tslint:disable: max-classes-per-file
import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import * as currency from "currency.js";
import { assert } from "./assert";
import { MonetaryValueConfig } from "./config";

const moneyValue = /^\d+(\.\d+)?$/;
moneyValue.example = "##.##";

/**
 * An ISO 4217 currency code that is supported by ShipEngine
 *
 * @see https://en.wikipedia.org/wiki/ISO_4217
 */
export enum Currency {
  UnitedStatesDollar = "USD",
  CanadianDollar = "CAD",
  AustralianDollar = "AUD",
  GreatBritishPound = "GBP",
  Euro = "EUR",
  NewZealandDollar = "NZD",
}


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

  public constructor(config: MonetaryValueConfig) {
    assert.type.object(config, "monetary value");

    let value = typeof config.value === "number"
      ? assert.number.nonNegative(config.value, "monetary value")
      : assert.string.pattern(config.value, moneyValue, "monetary value");

    this.value = currency(value).toString();
    this.currency = assert.string.enum(config.currency, Currency, "currency");

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
        { code: "E_CURRENCY_MISMATCH", currencies },  // <--- code used in Shipment class
        `All charges must be in the same currency. These charges include ${humanize.list(currencies)}`
      );
    }

    return new MonetaryValue({
      currency: [...uniqueCurrencies][0] || Currency.UnitedStatesDollar,
      value: total.toString(),
    });
  }
}
