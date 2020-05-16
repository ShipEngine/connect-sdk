import { hideAndFreeze, Joi, _internal } from "../internal";

/**
 * Custom identifiers for a resource
 */
export interface IdentifiersPOJO {
  [key: string]: string | undefined;
}


/**
 * Custom identifiers for a resource
 */
export class Identifiers {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "identifiers",
    schema: Joi.object().pattern(
      Joi.string(), Joi.string().trim().singleLine().allow("").max(100),
    ),
  };

  //#endregion
  //#region Public Fields

  readonly [key: string]: string | undefined;

  //#endregion

  public constructor(pojo: IdentifiersPOJO = {}) {
    // NOTE: Don't use Object.assign() here because it also copies Symbol properties
    for (let [key, value] of Object.entries(pojo)) {
      // @ts-expect-error
      this[key] = value;
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Identifiers);
