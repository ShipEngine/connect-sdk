import { AppDefinition, AppManifest, AppType, UUID } from "../../public";
import { ReferenceMap } from "./reference-map";
import { AppManifestPOJO, sdk } from "./sdk";
import { _internal } from "./utils";
import { Joi } from "./validation";


export interface AppPOJO extends AppDefinition {
  manifest: AppManifestPOJO;
}


export abstract class App {
  public static readonly [_internal] = {
    label: "ShipEngine Connect app",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      providerId: Joi.string().uuid().optional(),
      manifest: Joi.object({
        name: Joi.string().appName().required(),
        version: Joi.string().semver().required(),
        description: Joi.string().singleLine().allow(""),
        dependencies: Joi.object(),
        devDependencies: Joi.object(),
      }).unknown(true).required(),
    }),
  };

  public readonly [_internal] = {
    references: new ReferenceMap(),
  };

  public abstract readonly type: AppType;
  public readonly id: UUID;
  public readonly providerId: UUID;
  public readonly manifest: AppManifest;
  public readonly sdkVersion: number;

  public constructor(pojo: AppPOJO) {

    this.id = pojo.id;
    this.providerId = pojo.providerId || "";
    this.sdkVersion = Number.parseFloat(sdk.version);
    this.manifest = {
      ...pojo.manifest,
      description: pojo.manifest.description || "",
      dependencies: pojo.manifest.dependencies || {},
      devDependencies: pojo.manifest.devDependencies || {},
    };
  }
}
