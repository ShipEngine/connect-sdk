import { AppManifestPOJO, AppPOJO } from "../app-pojo";
import { UUID } from "../types";
import { ReferenceMap } from "./reference-map";
import { _internal } from "./utils";
import { Joi } from "./validation";

// NOTE: We can't use `import` syntax here because package.json is outside the TypeScript root dir
// tslint:disable-next-line: no-var-requires no-require-imports
const sdkManifest = require("../../../package.json") as AppManifestPOJO;

/**
 * A ShipEngine Integration Platform app
 */
export abstract class App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform app",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
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
   * A UUID that uniquely identifies the connection.
   * This ID should never change, even if the connection name changes.
   */
  public readonly id: UUID;

  /**
   * The app manifest (package.json file)
   */
  public readonly manifest: Required<AppManifestPOJO>;

  /**
   * The versio nof the ShipEngine Integration Platform SDK that the app was built for.
   * This is the major and minor version number, parsed as a float.
   */
  public readonly sdkVersion: number;

  //#endregion

  public constructor(pojo: AppPOJO) {
    this.id = pojo.id;
    this.sdkVersion = Number.parseFloat(sdkManifest.version);
    this.manifest = {
      ...pojo.manifest,
      description: pojo.manifest.description || "",
      dependencies: pojo.manifest.dependencies || {},
      devDependencies: pojo.manifest.devDependencies || {},
    };
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
      id: this.id,
      manifest: this.manifest,
    };
  }
}
