import { App as IApp, AppManifest, App as AppPOJO, AppType, UUID } from "../../definitions";
import { ReferenceMap } from "./reference-map";
import { sdk } from "./sdk";
import { _internal } from "./utils";
import { Joi } from "./validation";

export abstract class App implements IApp {
  public static [_internal] = {
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

  public [_internal] = {
    references: new ReferenceMap(),
  };

  public abstract type: AppType;
  public id: UUID;
  public manifest: AppManifest;
  public sdkVersion: number;

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
