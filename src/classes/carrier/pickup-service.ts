import { assert } from "../../assert";
import { PickupServicePOJO } from "../../pojos";
import { UUID } from "../../types";
import { App } from "../app";
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
   * Indicates whether the carrier provides a sandbox/development API for this pickup service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  public readonly hasSandbox: boolean;

  /**
   * The carrier that provides this service
   */
  public readonly  carrier: Carrier;

  public constructor(app: App, parent: Carrier, pojo: PickupServicePOJO) {
    this.carrier = parent;
    this.id = app._references.add(this, pojo, "pickup service");
    this.name = assert.string.nonWhitespace(pojo.name, "pickup service name");
    this.description = assert.string(pojo.description, "pickup service description", "");
    this.hasSandbox = assert.type.boolean(pojo.hasSandbox, "hasSandbox flag", false);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
