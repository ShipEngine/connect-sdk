import { DeliveryConfirmationType } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DeliveryConfirmationPOJO } from "../../pojos/carrier";
import { LocalizedInfoPOJO } from "../../pojos/common";
import { UUID } from "../../types";
import { App } from "../common/app";
import { Localization, localize } from "../common/localization";

const _private = Symbol("private fields");

/**
 * Delivery confirmation options offered by a carrier
 */
export class DeliveryConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "delivery confirmation",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      type: Joi.string().enum(DeliveryConfirmationType).required(),
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().min(1).max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
      }),
    }),
  };

  /** @internal */
  private readonly [_private]: {
    readonly app: App;
    readonly localization: Localization<LocalizedInfoPOJO>;
  };

  //#endregion
  //#region Public Fields

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
   * The type of confirmation
   */
  public type: DeliveryConfirmationType;

  //#endregion

  public constructor(pojo: DeliveryConfirmationPOJO, app: App) {
    this.id = pojo.id;
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.type = pojo.type;

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  /**
   * Creates a copy of the delivery confirmation, localized for the specified locale if possible.
   */
  public localize(locale: string): DeliveryConfirmation {
    let pojo = localize(this, locale);
    return new DeliveryConfirmation(pojo, this[_private].app);
  }

  /**
   * Returns the delivery confirmation as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): DeliveryConfirmationPOJO {
    let { localization } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(DeliveryConfirmation);
