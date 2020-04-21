// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { ContactInfoConfig, PersonNameConfig } from "./config";
import { Constructor } from "./types";


/**
 * A person's contact information
 */
export class ContactInfo extends contactInfoMixin() {
  public constructor(config: ContactInfoConfig) {
    super(config, false);
  }
}

/**
 * Extends a base class with contact information
 */
export function contactInfoMixin(base: Constructor = Object) {
  return class ContactInfoMixin extends base {
    public readonly name: PersonName;
    public readonly email?: string;
    public readonly phoneNumber?: string;
    public readonly phoneNumberExtension?: string;

    public constructor(config: ContactInfoConfig, isMixin: boolean) {
      base === Object ? super() : super(config, isMixin);
      assert.type.object(config, "contact info");
      this.name = new PersonName(config.name);
      this.email = config.email === undefined ? undefined
        : assert.string.nonWhitespace(config.email, "email address");
      this.phoneNumber = config.phoneNumber === undefined ? undefined
        : assert.string.nonWhitespace(config.phoneNumber, "phone number");
      this.phoneNumberExtension = config.phoneNumberExtension === undefined ? undefined
        : assert.string.nonWhitespace(config.phoneNumberExtension, "phone number extension");

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

  /**
   * Creates a ParsedName object from a string or config object
   */
  public constructor(config: string | PersonNameConfig) {
    if (typeof config === "string") {
      config = PersonName.parse(config);
    }

    assert.type.object(config, "name");
    this.first = assert.string.nonWhitespace(config.first, "first name");
    this.last = assert.string(config.last, "last name");

    // Prevent modifications after validation
    Object.freeze(this);
  }

  /**
   * Parses a full name string
   */
  public static parse(fullName: string): PersonNameConfig {
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
