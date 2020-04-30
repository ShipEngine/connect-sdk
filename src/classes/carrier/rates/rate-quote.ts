import { RateQuotePOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { Rate } from "./rate";

/**
 * Quoted shipping rates for the specified rate criteria
 */
export class RateQuote {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "rate quote",
    schema: Joi.object({
      rates: Joi.array().items(Rate[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * A list of rates that match the specified rate criteria
   */
  public readonly rates: ReadonlyArray<Rate>;

  //#endregion

  public constructor(pojo: RateQuotePOJO, app: App) {
    validate(pojo, RateQuote);

    this.rates = pojo.rates.map((rate) => new Rate(rate, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RateQuote);
