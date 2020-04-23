// tslint:disable: max-classes-per-file
import { assert } from "../assert";
import { Constructor } from "../internal-types";
import { ContactInfoPOJO, PersonNamePOJO } from "../pojos";

/**
 * A person's contact information
 */
export class ContactInfo extends contactInfoMixin() {
  public constructor(pojo: ContactInfoPOJO) {
    super(pojo, false);
  }
}

/**
 * Extends a base class with contact information
 */
export function contactInfoMixin(base: Constructor = Object) {
  return class ContactInfoMixin extends base {
    public readonly name: PersonNamePOJO;
    public readonly email?: string;
    public readonly phoneNumber?: string;
    public readonly phoneNumberExtension?: string;

    public constructor(pojo: ContactInfoPOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "contact info");
      this.name = new PersonName(pojo.name);
      this.email = pojo.email === undefined ? undefined
        : assert.string.nonWhitespace(pojo.email, "email address");
      this.phoneNumber = pojo.phoneNumber === undefined ? undefined
        : assert.string.nonWhitespace(pojo.phoneNumber, "phone number");
      this.phoneNumberExtension = pojo.phoneNumberExtension === undefined ? undefined
        : assert.string.nonWhitespace(pojo.phoneNumberExtension, "phone number extension");

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}

/**
 * A person's name that has been parsed into separate fields.
 */
export class PersonName {
  public readonly first: string;
  public readonly last: string;

  public constructor(pojo: string | PersonNamePOJO) {
    if (typeof pojo === "string") {
      pojo = PersonName.parse(pojo);
    }

    assert.type.object(pojo, "name");
    this.first = assert.string.nonWhitespace(pojo.first, "first name");
    this.last = assert.string(pojo.last, "last name");

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
