import { assert } from "../../assert";
import { RateCriteriaConfig } from "../../config";
import { NewShipment } from "../../shipment";
import { ShippingProviderApp } from "../app";

/**
 * Specifies the criteria for rate quotes
 */
export class RateCriteria {
  /**
   * The shipment information used to get rate quotes
   */
  public readonly shipment: NewShipment;

  /**
   * Creates a RateCriteria object from a config object
   */
  public constructor(app: ShippingProviderApp, config: RateCriteriaConfig) {
    assert.type.object(config, "rate criteria");
    this.shipment = new NewShipment(app, config.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
