// tslint:disable: max-classes-per-file
import { CustomDataPOJO, IdentifierPOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
 */
export class CustomData {
  //#region Class Fields

  public static readonly label = "custom data";

  /** @internal */
  public static readonly schema = Joi.object().pattern(Joi.string(), Joi.string().allow(""));

  //#endregion
  //#region Instance Fields

  [key: string]: string;

  //#endregion

  public constructor(pojo: CustomDataPOJO) {
    // Copy all keys & values to this object
    // NOTE: DO NOT use Object.assign() here because it copies Symbol keys. We only want string keys.
    for (let key of Object.getOwnPropertyNames(pojo)) {
      let value = pojo[key];
      if (value !== undefined) {
        this[key] = pojo[key];
      }
    }

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

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
