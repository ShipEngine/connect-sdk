// tslint:disable: max-classes-per-file
import { AppManifestPOJO, AppPOJO } from "../app-pojo";
import { ReferenceMap } from "./reference-map";
import { _internal } from "./utils";
import { Joi } from "./validation";

/**
 * A ShipEngine Integration Platform app
 */
export abstract class App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform app",
    schema: Joi.object({
      manifest: Joi.object({
        name: Joi.string().appName().required(),
        version: Joi.string().semver().required(),
        description: Joi.string().trim().singleLine().allow("").max(1000),
        dependencies: Joi.object(),
        devDependencies: Joi.object(),
      }).unknown(true).required(),
    }),
  };

  /** @internal */
  public readonly [_internal] = {
    references: new ReferenceMap(),
  };

  //#endregion
  //#region Public Fields

  /**
   * The app manifest (package.json file)
   */
  public readonly manifest: AppManifestPOJO;

  //#endregion

  public constructor(pojo: AppPOJO) {
    this.manifest = pojo.manifest;
    this.manifest.description = pojo.manifest.description || "";
  }

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public abstract localize(locale: string): App;
}
