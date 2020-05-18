import { hideAndFreeze, _internal } from "../internal/utils";
import { Joi } from "../internal/validation";

/**
 * A person's name that has been parsed into separate fields.
 */
export interface PersonNamePOJO {
  title?: string;
  given: string;
  middle?: string;
  family?: string;
  suffix?: string;
}


/**
 * A person's name that has been parsed into separate fields.
 */
export class PersonName {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "name",
    schema: Joi.alternatives(
      Joi.string().trim().singleLine().min(1).max(100),
      Joi.object({
        title: Joi.string().trim().singleLine().allow("").max(100),
        given: Joi.string().trim().singleLine().min(1).max(100).required(),
        middle: Joi.string().trim().singleLine().allow("").max(100),
        family: Joi.string().trim().singleLine().allow("").max(100),
        suffix: Joi.string().trim().singleLine().allow("").max(100),
      })
    ),
  };

  //#endregion

  //#region Public Fields

  public readonly title: string;
  public readonly given: string;
  public readonly middle: string;
  public readonly family: string;
  public readonly suffix: string;

  //#endregion

  public constructor(pojo: string | PersonNamePOJO) {
    if (typeof pojo === "string") {
      pojo = { given: pojo, family: "" };
    }

    this.title = pojo.title || "";
    this.given = pojo.given;
    this.middle = pojo.middle || "";
    this.family = pojo.family || "";
    this.suffix = pojo.suffix || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PersonName);
