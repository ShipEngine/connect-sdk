import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import { assert } from "../assert";
import { DeliveryConfirmationConfig } from "../config";
import { readArrayConfig, readConfig } from "../read-config";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../types";

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
    this.id = assert.string.uuid(config.name, "delivery confirmation ID");
    this.name = assert.string.nonWhitespace(config.name, "delivery confirmation name");
    this.description = assert.string(config.name, "delivery confirmation description", "");

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Reads the config for a delivery confirmation
   */
  public static async readConfig(config: InlineOrReference<DeliveryConfirmationConfig>)
  : Promise<DeliveryConfirmationConfig> {
    try {
      return await readConfig(config);
    }
    catch (error) {
      throw ono(error, `Error reading the delivery confirmation config: ${humanize(config)}`);
    }
  }

  /**
   * Reads the config for an array of delivery confirmations
   */
  public static async readArrayConfig(config: InlineOrReferenceArray<DeliveryConfirmationConfig>)
  : Promise<DeliveryConfirmationConfig[]> {
    try {
      return await readArrayConfig(config);
    }
    catch (error) {
      throw ono(error, `Error reading the delivery confirmation config: ${humanize(config)}`);
    }
  }
}
