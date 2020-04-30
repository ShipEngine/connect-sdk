import { AppPOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { _internal } from "../utils";
import { ReferenceMap } from "./reference-map";

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
    }),
  };

  /** @internal */
  public readonly [_internal] = {
    references: new ReferenceMap(),
  };

  //#endregion
  //#region Public Fields

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
}
