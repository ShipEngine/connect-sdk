import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { PersonNamePOJO } from "../../../pojos/common";

/**
 * A person's name that has been parsed into separate fields.
 */
export class PersonName {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "name",
    schema: Joi.object({
      first: Joi.string().trim().singleLine().min(1).max(100).required(),
      last: Joi.string().trim().singleLine().min(1).max(100).required(),
    }),
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
      this.given = pojo;
      this.title = "";
      this.middle = "";
      this.family = "";
      this.suffix = "";
    }

    else {
      this.title = pojo.title || "";
      this.given = pojo.given || "";
      this.middle = pojo.middle || "";
      this.family = pojo.family || "";
      this.suffix = pojo.suffix || "";
    }

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the full name
   */
  // public toString(): string {
  //   if (this.first && this.last) {
  //     return `${this.first} ${this.last}`;
  //   }
  //   else {
  //     return this.first || this.last;
  //   }
  // }
}

// Prevent modifications to the class
hideAndFreeze(PersonName);
