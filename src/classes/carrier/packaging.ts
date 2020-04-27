import { PackagingPOJO } from "../../pojos/carrier";
import { UUID } from "../../types";
import { Joi } from "../../validation";
import { App } from "../common/app";

/**
 * Describes a type of packaging
 */
export class Packaging {
  //#region Class Fields

  public static readonly label = "packaging";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
    description: Joi.string().trim().singleLine().allow("").max(1000),
    requiresWeight: Joi.boolean(),
    requiresDimensions: Joi.boolean(),
  });

  //#endregion

  //#region Instance Fields

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
    this.id = app._references.add(this, pojo);
    this.name = pojo.name;
    this.description = pojo.description || "";
    this.requiresWeight = pojo.requiresWeight || false;
    this.requiresDimensions = pojo.requiresDimensions || false;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
