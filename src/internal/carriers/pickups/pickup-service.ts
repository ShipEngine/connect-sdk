import { LocalizedInfoPOJO, PickupService as IPickupService, PickupServicePOJO } from "../../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, Localization, localize, _internal } from "../../common";

const _private = Symbol("private fields");

export class PickupService extends DefinitionIdentifier implements IPickupService {
  public static readonly [_internal] = {
    label: "pickup service",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      hasSandbox: Joi.boolean(),
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
  public readonly hasSandbox: boolean;

  public constructor(pojo: PickupServicePOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.hasSandbox = pojo.hasSandbox || false;

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  public localize(locale: string): PickupService {
    let pojo = localize(this, locale);
    return new PickupService(pojo, this[_private].app);
  }

  public toJSON(locale?: string): PickupServicePOJO {
    let { localization } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }
}
