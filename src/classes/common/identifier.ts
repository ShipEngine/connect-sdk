import { hideAndFreeze, Joi, _internal } from "../../internal";
import { IdentifierPOJO } from "../../pojos/common";

/**
 * A value that identifies a resource
 */
export class Identifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "identifier",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly id: string;
  public readonly name: string;

  //#endregion

  public constructor(pojo: IdentifierPOJO) {
    this.id = pojo.id;
    this.name = pojo.name;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Identifier);
