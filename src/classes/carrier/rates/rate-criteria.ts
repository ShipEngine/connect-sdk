import { assert } from "../../../assert";
import { RateCriteriaPOJO } from "../../../pojos";
import { App } from "../../app";
import { NewShipment } from "../../shipment";

/**
 * Specifies the criteria for rate quotes
 */
export class RateCriteria {
  /**
   * The shipment information used to get rate quotes
   */
  public readonly shipment: NewShipment;

  public constructor(app: App, pojo: RateCriteriaPOJO) {
    assert.type.object(pojo, "rate criteria");
    this.shipment = new NewShipment(app, pojo.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
