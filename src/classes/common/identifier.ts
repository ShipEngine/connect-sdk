import { IdentifierPOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * A value that identifies a resource
 */
export class Identifier {
  //#region Class Fields

  public static readonly label = "identifier";

  /** @internal */
  public static readonly schema = Joi.object({
    id: Joi.string().trim().singleLine().min(1).max(100).required(),
    name: Joi.string().trim().singleLine().min(1).max(100).required(),
  });

  //#endregion
  //#region Instance Fields

  public readonly id: string;
  public readonly name: string;

  //#endregion

  public constructor(pojo: IdentifierPOJO) {
    this.id = pojo.id;
    this.name = pojo.name;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
