import { assert } from "./assert";
import { ParsedNameConfig } from "./config";

/**
 * A person's name that has been parsed into separate fields.
 */
export class ParsedName {
  public readonly first: string;
  public readonly last: string;

  /**
   * Creates a ParsedName object from a string or config object
   */
  public constructor(config: string | ParsedNameConfig) {
    if (typeof config === "string") {
      config = ParsedName.parse(config);
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
  public static parse(fullName: string): ParsedNameConfig {
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
