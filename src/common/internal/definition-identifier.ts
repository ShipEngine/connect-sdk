import { Identifiers, IdentifiersPOJO } from "../identifiers";
import { UUID } from "../types";
import { _internal } from "./utils";
import { Joi } from "./validation";

/**
 * Identifies an object in an app definition
 */
export interface DefinitionIdentifierPOJO {
  /**
   * A UUID that uniquely identifies the object. This ID should never change.
   */
  id: UUID;

  /**
   * Your own identifiers for the object
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies an object in an app definition
 */
export class DefinitionIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "object",
    schema: Joi.object({
      id: Joi.string().uuid().required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * A UUID that uniquely identifies the object. This ID should never change.
   */
  public readonly id: UUID;

  /**
   * Your own identifiers for the object
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: DefinitionIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}
