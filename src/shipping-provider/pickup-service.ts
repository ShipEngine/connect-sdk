import { assert } from "../assert";
import { CarrierConfig, PickupServiceConfig } from "../config";
import { UUID } from "../types";
import { Carrier } from "./carrier";

/**
 * A package pickup service that is offered by a shipping provider
 */
export class PickupService {
  /**
   * A UUID that uniquely identifies the pickup service.
   * This ID should never change, even if the service name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly service name (e.g. "One-Time Pickup", "Recurring Pickup", "Drop-Off")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  public readonly description: string;

  /**
   * The carrier that provides this service
   */
  public readonly carrier: Carrier;

  /**
   * Creates a PickupService object from a fully-resolved config object
   */
  public constructor(config: PickupServiceConfig) {
    assert.type.object(config, "pickup service");
    this.id = assert.string.uuid(config.id, "pickup service ID");
    this.name = assert.string.nonWhitespace(config.name, "pickup service name");
    this.description = assert.string(config.description, "pickup service description", "");
    this.carrier = new Carrier(config.carrier as CarrierConfig);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
