import { assert } from "../../assert";
import { NewShipmentConfig } from "../../config";
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
  public constructor(app: ShippingProviderApp, config: NewShipmentConfig) {
    assert.type.object(config, "rate criteria");
    this.shipment = new NewShipment(app, config);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
