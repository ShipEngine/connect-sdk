import { assert } from "../../../assert";
import { TrackingCriteriaPOJO } from "../../../pojos";
import { App } from "../../app";
import { Shipment } from "../../shipment";

/**
 * Specifies the criteria for tracking details
 */
export class TrackingCriteria {
  /**
   * The shipment to get tracking details for
   */
  public readonly shipment: Shipment;

  public constructor(app: App, pojo: TrackingCriteriaPOJO) {
    assert.type.object(pojo, "tracking criteria");
    this.shipment = new Shipment(app, pojo.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
