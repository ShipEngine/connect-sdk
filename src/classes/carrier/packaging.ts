import { hideAndFreeze, Joi, _internal } from "../../internal";
import { PackagingPOJO } from "../../pojos/carrier";
import { LocalizedInfoPOJO } from "../../pojos/common/localization-pojo";
import { UUID } from "../../types";
import { App } from "../common/app";
import { Localization, localize } from "../common/localization";

const _private = Symbol("private fields");

/**
 * Describes a type of packaging
 */
export class Packaging {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "packaging",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      requiresWeight: Joi.boolean(),
      requiresDimensions: Joi.boolean(),
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
   * A UUID that uniquely identifies the packaging.
   * This ID should never change, even if the packaging name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  public readonly description: string;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  public readonly requiresWeight: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  public readonly requiresDimensions: boolean;

  //#endregion

  public constructor(pojo: PackagingPOJO, app: App) {
    this.id = pojo.id;
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

  /**
   * Creates a copy of the packaging, localized for the specified locale if possible.
   */
  public localize(locale: string): Packaging {
    let pojo = localize(this, locale);
    return new Packaging(pojo, this[_private].app);
  }

  /**
   * Returns the packaging as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
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

// Prevent modifications to the class
hideAndFreeze(Packaging);
