import { PickupServicePOJO } from "../../pojos/carrier";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App } from "../common";
import { Carrier } from "./carrier";

/**
 * A package pickup service that is offered by a carrier
 */
export class PickupService {
  //#region Class Fields

  public static readonly label = "pickup service";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    hasSandbox: Joi.boolean(),
  });

  //#endregion
  //#region Instance Fields

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

  //#endregion

  public constructor(pojo: PickupServicePOJO, app: App, parent: Carrier) {
    this.carrier = parent;
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.hasSandbox = pojo.hasSandbox || false;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
