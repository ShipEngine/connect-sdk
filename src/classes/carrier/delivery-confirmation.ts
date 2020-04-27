import { DeliveryConfirmationClass } from "../../enums";
import { DeliveryConfirmationPOJO } from "../../pojos/carrier";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App } from "../common/app";

/**
 * Delivery confirmation options offered by a carrier
 */
export class DeliveryConfirmation {
  //#region Class Fields

  public static readonly label = "delivery confirmation";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    class: Joi.string().enum(DeliveryConfirmationClass).required(),
  });

  //#endregion
  //#region Instance Fields

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

  //#endregion

  public constructor(pojo: DeliveryConfirmationPOJO, app: App) {
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.class = pojo.class;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
