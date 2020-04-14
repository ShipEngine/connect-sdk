import { App } from "../../app";
import { assert } from "../../assert";
import { TrackingCriteriaConfig } from "../../config";
import { Shipment } from "../../shipment";

/**
 * Specifies the criteria for tracking details
 */
export class TrackingCriteria {
  /**
   * The shipment to get tracking details for
   */
  public readonly shipment: Shipment;

  /**
   * Creates a TrackingCriteria object from a config object
   */
  public constructor(app: App, config: TrackingCriteriaConfig) {
    assert.type.object(config, "tracking criteria");
    this.shipment = new Shipment(app, config.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
