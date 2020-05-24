import { DeliveryConfirmation as IDeliveryConfirmation, DeliveryConfirmationPOJO, DeliveryConfirmationType, LocalizedInfoPOJO } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, Localization, localize, _internal } from "../common";

const _private = Symbol("private fields");

export class DeliveryConfirmation extends DefinitionIdentifier implements IDeliveryConfirmation {
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


  private readonly [_private]: {
    readonly app: App;
    readonly localization: Localization<LocalizedInfoPOJO>;
  };

  public readonly name: string;
  public readonly description: string;
  public type: DeliveryConfirmationType;

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

  public localize(locale: string): DeliveryConfirmation {
    let pojo = localize(this, locale);
    return new DeliveryConfirmation(pojo, this[_private].app);
  }

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
