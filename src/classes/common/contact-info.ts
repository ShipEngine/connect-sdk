// tslint:disable: max-classes-per-file
import { Constructor } from "../../internal-types";
import { ContactInfoPOJO, PersonNamePOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { hideAndFreeze, _internal } from "../utils";

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

  public readonly first: string;
  public readonly last: string;

  //#endregion

  public constructor(pojo: string | PersonNamePOJO) {
    if (typeof pojo === "string") {
      pojo = PersonName.parse(pojo);
    }

    this.first = pojo.first;
    this.last = pojo.last;

    // Make this object immutable
    hideAndFreeze(this);
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

// Prevent modifications to the class
hideAndFreeze(PersonName);

/**
 * A person's contact information
 */
export class ContactInfo extends contactInfoMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "contact info",
    schema: Joi.object({
      name: Joi.alternatives(Joi.string().trim().singleLine().min(1).max(100), PersonName[_internal].schema).required(),
      email: Joi.string().email().allow(""),
      phoneNumber: Joi.string().trim().singleLine().allow("").max(30),
      phoneNumberExtension: Joi.string().trim().singleLine().allow("").max(30),
    }),
  };

  //#endregion

  public constructor(pojo: ContactInfoPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ContactInfo);

/**
 * Extends a base class with contact information
 * @internal
 */
export function contactInfoMixin(base: Constructor = Object) {
  return class ContactInfoMixin extends base {
    //#region Public Fields

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
