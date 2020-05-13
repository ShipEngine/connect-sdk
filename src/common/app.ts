import { Joi, ReferenceMap, _internal } from "../internal";

/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppPOJO {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}


/**
 * A ShipEngine Integration Platform app
 */
export abstract class App {

  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform app",
    schema: Joi.object({
      name: Joi.string().appName().required(),
      version: Joi.string().semver().required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
    }).unknown(true),
  };

  /** @internal */
  public readonly [_internal] = {
    references: new ReferenceMap(),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates the type of app
   */
  public abstract readonly type: string;

  /**
   * The ShipEngine Integration Platform app name.
   * This is a scoped NPM package name (e.g. @company-name/app-name)
   */
  public readonly name: string;

  /**
   * The ShipEngine Integration Platform app version number.
   * This is a semantic version number (e.g. "1.23.456")
   */
  public readonly version: string;

  /**
   * A short, user-friendly description of the app
   */
  public readonly description: string;

  //#endregion

  public constructor(pojo: AppPOJO) {
    this.name = pojo.name;
    this.version = pojo.version;
    this.description = pojo.description || "";
  }

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public abstract localize(locale: string): App;

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   */
  public toJSON(): AppPOJO {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
    };
  }
}
