import { App } from "../../app";
import { assert } from "../../assert";
import { RateQuoteConfig } from "../../config";
import { Rate } from "./rate";

/**
 * Quoted shipping rates for the specified rate criteria
 */
export class RateQuote {
  /**
   * A list of rates that match the specified rate criteria
   */
  public readonly rates: ReadonlyArray<Rate>;

  /**
   * Creates a RateCriteria object from a config object
   */
  public constructor(app: App, config: RateQuoteConfig) {
    assert.type.object(config, "rate");
    this.rates = assert.array(config.rates, "rates").map((rate) => new Rate(app, rate));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.rates);
  }
}
