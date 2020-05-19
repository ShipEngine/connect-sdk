import { DeliveryConfirmationType, LocalizedInfoPOJO } from "../common";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, Localization, localize, _internal } from "../common/internal";
import { DeliveryConfirmationPOJO } from "./delivery-confirmation-pojo";

const _private = Symbol("private fields");

/**
 * Delivery confirmation options offered by a carrier
 */
export class DeliveryConfirmation extends DefinitionIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "delivery confirmation",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      type: Joi.string().enum(DeliveryConfirmationType).required(),
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().allow("").max(100),
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
    super(pojo);

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
