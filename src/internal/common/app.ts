import { App as IApp, AppManifest, AppPOJO, AppType, UUID } from "../../public";
import { ReferenceMap } from "./reference-map";
import { sdk } from "./sdk";
import { _internal } from "./utils";
import { Joi } from "./validation";

export abstract class App implements IApp {
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

  public readonly [_internal] = {
    references: new ReferenceMap(),
  };

  public abstract readonly type: AppType;
  public readonly id: UUID;
  public readonly manifest: AppManifest;
  public readonly sdkVersion: number;

  public constructor(pojo: AppPOJO) {
    this.id = pojo.id;
    this.sdkVersion = Number.parseFloat(sdk.version);
    this.manifest = {
      ...pojo.manifest,
      description: pojo.manifest.description || "",
      dependencies: pojo.manifest.dependencies || {},
      devDependencies: pojo.manifest.devDependencies || {},
    };
  }
}
