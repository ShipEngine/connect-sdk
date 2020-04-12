// tslint:disable: max-classes-per-file

import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import * as currency from "currency.js";
import { assert } from "./assert";
import { DimensionsConfig, MonetaryValueConfig, QuantityConfig, WeightConfig } from "./config";

/**
 * The dimensions of a package
 */
export class Dimensions {
  public readonly length: number;
  public readonly width: number;
  public readonly height: number;
  public readonly unit: LengthUnit;

  public constructor(config: DimensionsConfig) {
    assert.type.object(config, "dimensions");
    this.length = assert.number.positive(config.length, "package length");
    this.width = assert.number.positive(config.width, "package width");
    this.height = assert.number.positive(config.height, "package height");
    this.unit = assert.string.enum(config.unit, LengthUnit, "dimension unit");

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Converts the dimensions to inches
   */
  public toInches(): Dimensions {
    switch (this.unit) {
      case LengthUnit.Centimeters:
        const centimetersToInches = 0.393701;
        return new Dimensions({
          length: this.length * centimetersToInches,
          width: this.width * centimetersToInches,
          height: this.height * centimetersToInches,
          unit: LengthUnit.Inches,
        });

      default:
        return this;
    }
  }

  /**
   * Converts the dimensions to centimeters
   */
  public toCentimeters(): Dimensions {
    switch (this.unit) {
      case LengthUnit.Inches:
        const inchesToCentimeters = 2.54;
        return new Dimensions({
          length: this.length * inchesToCentimeters,
          width: this.width * inchesToCentimeters,
          height: this.height * inchesToCentimeters,
          unit: LengthUnit.Centimeters,
        });

      default:
        return this;
    }
  }
}

/**
 * A length measurement unit
 */
export enum LengthUnit {
  Inches = "in",
  Centimeters = "cm"
}

/**
 * The weight of a package
 */
export class Weight {
  public readonly value: number;
  public readonly unit: WeightUnit;

  public constructor(config: WeightConfig) {
    assert.type.object(config, "weight");
    this.value = assert.number.positive(config.value, "weight");
    this.unit = assert.string.enum(config.unit, WeightUnit, "weight unit");

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Converts the weight to ounces
   */
  public toOunces(): Weight {
    switch (this.unit) {
      case WeightUnit.Grams:
        return new Weight({
          value: this.value * 0.035274,
          unit: WeightUnit.Ounces,
        });

      case WeightUnit.Kilograms:
        return new Weight({
          value: this.value * 35.274,
          unit: WeightUnit.Ounces,
        });

      case WeightUnit.Pounds:
        return new Weight({
          value: this.value * 16,
          unit: WeightUnit.Ounces,
        });

      default:
        return this;
    }
  }

  /**
   * Converts the weight to grams
   */
  public toGrams(): Weight {
    switch (this.unit) {
      case WeightUnit.Kilograms:
        return new Weight({
          value: this.value * 1000,
          unit: WeightUnit.Grams,
        });

      case WeightUnit.Pounds:
        return new Weight({
          value: this.value * 453.592,
          unit: WeightUnit.Grams,
        });

      case WeightUnit.Ounces:
        return new Weight({
          value: this.value * 28.3495,
          unit: WeightUnit.Grams,
        });

      default:
        return this;
    }
  }
}

/**
 * A weight measurement unit
 */
export enum WeightUnit {
  Grams = "g",
  Ounces = "oz",
  Kilograms = "kg",
  Pounds = "lb"
}

/**
 * The quantity of items in a package
 */
export class Quantity {
  public readonly value: number;
  public readonly unit: QuantityUnit;

  public constructor(config: QuantityConfig) {
    assert.type.object(config, "quantity");
    this.value = assert.number.positive(config.value, "quantity");
    this.unit = assert.string.enum(config.unit, QuantityUnit, "quantity unit");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

/**
 * A quantity measurement unit
 */
export enum QuantityUnit {
  Each = "ea",
}

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
