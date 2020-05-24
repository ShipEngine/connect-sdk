import { LocalizedInfoPOJO, Packaging as IPackaging, PackagingPOJO } from "../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, Localization, localize, _internal } from "../common";

const _private = Symbol("private fields");

export class Packaging extends DefinitionIdentifier implements IPackaging {
  public static readonly [_internal] = {
    label: "packaging",
    schema: DefinitionIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      requiresWeight: Joi.boolean(),
      requiresDimensions: Joi.boolean(),
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
  public readonly requiresWeight: boolean;
  public readonly requiresDimensions: boolean;

  public constructor(pojo: PackagingPOJO, app: App) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.requiresWeight = pojo.requiresWeight || false;
    this.requiresDimensions = pojo.requiresDimensions || false;

    this[_private] = {
      app,
      localization: new Localization(pojo.localization || {}),
    };

    // Make this object immutable
    hideAndFreeze(this);

    app[_internal].references.add(this);
  }

  public localize(locale: string): Packaging {
    let pojo = localize(this, locale);
    return new Packaging(pojo, this[_private].app);
  }

  public toJSON(locale?: string): PackagingPOJO {
    let { localization } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...this,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }
}
