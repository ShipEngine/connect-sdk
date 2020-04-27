import { RateQuotePOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { Rate } from "./rate";

/**
 * Quoted shipping rates for the specified rate criteria
 */
export class RateQuote {
  //#region Class Fields

  public static readonly label = "rate quote";

  /** @internal */
  public static readonly schema = Joi.object({
    rates: Joi.array().items(Rate.schema).required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * A list of rates that match the specified rate criteria
   */
  public readonly rates: ReadonlyArray<Rate>;

  //#endregion

  public constructor(pojo: RateQuotePOJO, app: App) {
    validate(pojo, RateQuote);

    this.rates = pojo.rates.map((rate) => new Rate(rate, app));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.rates);
  }
}
