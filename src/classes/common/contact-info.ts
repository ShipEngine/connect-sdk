// tslint:disable: max-classes-per-file
import { Constructor } from "../../internal-types";
import { ContactInfoPOJO, PersonNamePOJO } from "../../pojos/common";
import { Joi } from "../../validation";

/**
 * A person's name that has been parsed into separate fields.
 */
export class PersonName {
  //#region Class Fields

  public static readonly label = "name";

  /** @internal */
  public static readonly schema = Joi.object({
    first: Joi.string().trim().singleLine().min(1).max(100).required(),
    last: Joi.string().trim().singleLine().min(1).max(100).required(),
  });

  //#endregion
  //#region Instance Fields

  public readonly first: string;
  public readonly last: string;

  //#endregion

  public constructor(pojo: string | PersonNamePOJO) {
    if (typeof pojo === "string") {
      pojo = PersonName.parse(pojo);
    }

    this.first = pojo.first;
    this.last = pojo.last;

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Parses a full name string
   */
  public static parse(fullName: string): PersonNamePOJO {
    let separator = fullName.indexOf(" ");
    if (separator >= 0) {
      let first = fullName.slice(0, separator);
      let last = fullName.slice(separator + 1);
      return { first, last };
    }
    else {
      return { first: fullName, last: "" };
    }
  }

  /**
   * Returns the full name
   */
  public toString(): string {
    if (this.first && this.last) {
      return `${this.first} ${this.last}`;
    }
    else {
      return this.first || this.last;
    }
  }
}

/**
 * A person's contact information
 */
export class ContactInfo extends contactInfoMixin() {
  //#region Class Fields

  public static readonly label = "contact info";

  /** @internal */
  public static readonly schema = Joi.object({
    name: Joi.alternatives(Joi.string().trim().singleLine().min(1).max(100), PersonName.schema).required(),
    email: Joi.string().email().allow(""),
    phoneNumber: Joi.string().trim().singleLine().allow("").max(30),
    phoneNumberExtension: Joi.string().trim().singleLine().allow("").max(30),
  });

  //#endregion

  public constructor(pojo: ContactInfoPOJO) {
    super(pojo);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

/**
 * Extends a base class with contact information
 */
export function contactInfoMixin(base: Constructor = Object) {
  return class ContactInfoMixin extends base {
    //#region Instance Fields

    public readonly name: PersonNamePOJO;
    public readonly email: string;
    public readonly phoneNumber: string;
    public readonly phoneNumberExtension: string;

    //#endregion

    public constructor(pojo: ContactInfoPOJO) {
      base === Object ? super() : super(pojo);

      this.name = new PersonName(pojo.name);
      this.email = pojo.email || "";
      this.phoneNumber = pojo.phoneNumber || "";
      this.phoneNumberExtension = pojo.phoneNumberExtension || "";
    }
  };
}
