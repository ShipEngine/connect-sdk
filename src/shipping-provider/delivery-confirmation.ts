import { assert } from "../assert";
import { DeliveryConfirmationConfig } from "../config";
import { UUID } from "../types";

/**
 * Delivery confirmation options offered by a shipping provider
 */
export class DeliveryConfirmation {
  /**
   * A UUID that uniquely identifies the delivery confirmation type.
   * This ID should never change, even if the name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  public readonly description: string;

  /**
   * Creates a DeliveryConfirmation object from a fully-resolved config object
   */
  public constructor(config: DeliveryConfirmationConfig) {
    assert.type.object(config, "delivery confirmation");
    this.id = assert.string.uuid(config.id, "delivery confirmation ID");
    this.name = assert.string.nonWhitespace(config.name, "delivery confirmation name");
    this.description = assert.string(config.description, "delivery confirmation description", "");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
