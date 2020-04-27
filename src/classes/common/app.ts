import { AppPOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { hidePrivateFields } from "../utils";
import { ReferenceMap } from "./reference-map";

/**
 * A ShipEngine Integration Platform app
 */
export abstract class App {
  //#region Class Fields

  public static readonly label: string = "ShipEngine Integration Platform app";

  /** @internal */
  public static readonly schema = Joi.object({
    name: Joi.string().appName().required(),
    version: Joi.string().semver().required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
  });

  //#endregion
  //#region Instance Fields

  /**
   * Keeps track of distinct POJO object references and UUIDs
   * @internal
   */
  public readonly _references = new ReferenceMap();

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

    // Hide private fields
    hidePrivateFields(this);
  }
}
