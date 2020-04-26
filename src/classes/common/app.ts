import { AppManifestPOJO } from "../../pojos/common";
import { Joi, validate } from "../../validation";
import { hidePrivateFields } from "../utils";
import { ReferenceMap } from "./reference-map";

/**
 * A ShipEngine Integration Platform app
 */
export class App {
  //#region Class Fields

  public static readonly label = "ShipEngine Integration Platform app";

  /** @internal */
  public static readonly schema = Joi.object({
    version: Joi.string().semver().required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * Keeps track of distinct POJO object references and UUIDs
   * @internal
   */
  public readonly _references = new ReferenceMap();

  /**
   * The ShipEngine Integration Platform app version number.
   * This is a semantic version number (e.g. "1.23.456")
   */
  public readonly version: string;

  //#endregion

  public constructor(manifest: AppManifestPOJO) {
    validate(manifest, App);

    this.version = manifest.version!;

    // Hide the internal _references field
    hidePrivateFields(this);

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Frees-up memory that is that only needed while the app is being loaded.
   */
  public finishedLoading() {
    this._references.finishedLoading();
  }
}
