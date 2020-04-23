import { assert } from "../../../assert";
import { RateQuotePOJO } from "../../../pojos";
import { App } from "../../app";
import { Rate } from "./rate";

/**
 * Quoted shipping rates for the specified rate criteria
 */
export class RateQuote {
  /**
   * A list of rates that match the specified rate criteria
   */
  public readonly rates: ReadonlyArray<Rate>;

  public constructor(app: App, pojo: RateQuotePOJO) {
    assert.type.object(pojo, "rate");
    this.rates = assert.array(pojo.rates, "rates").map((rate) => new Rate(app, rate));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.rates);
  }
}
