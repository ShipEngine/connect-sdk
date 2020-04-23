import { assert } from "../../assert";
import { DeliveryConfirmationClass } from "../../enums";
import { DeliveryConfirmationPOJO } from "../../pojos";
import { UUID } from "../../types";
import { App } from "../app";

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
   * The class of confirmation
   */
  public class: DeliveryConfirmationClass;

  public constructor(app: App, pojo: DeliveryConfirmationPOJO) {
    assert.type.object(pojo, "delivery confirmation");
    this.id = app._references.add(this, pojo, "delivery confirmation");
    this.name = assert.string.nonWhitespace(pojo.name, "delivery confirmation name");
    this.description = assert.string(pojo.description, "delivery confirmation description", "");
    this.class = assert.string.enum(pojo.class, DeliveryConfirmationClass, "delivery confirmation class");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
