// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { AddressConfig, ContactInfoConfig } from "./config";
import { Country } from "./countries";
import { ParsedName } from "./parsed-name";

/**
 * A person's contact information
 */
export class ContactInfo {
  public readonly name: ParsedName;
  public readonly email?: string;
  public readonly phoneNumber?: string;
  public readonly phoneNumberExtension?: string;

  public constructor(config: ContactInfoConfig, freeze = true) {
    assert.type.object(config, "contact info");
    this.name = new ParsedName(config.name);
    this.email = config.email === undefined ? undefined
      : assert.string.nonWhitespace(config.email, "email address");
    this.phoneNumber = config.phoneNumber === undefined ? undefined
      : assert.string.nonWhitespace(config.phoneNumber, "phone number");
    this.phoneNumberExtension = config.phoneNumberExtension === undefined ? undefined
      : assert.string.nonWhitespace(config.phoneNumberExtension, "phone number extension");

    if (freeze) {
      // Prevent modifications after validation
      Object.freeze(this);
    }
  }
}

/**
 * A mailing address
 */
export class Address extends ContactInfo {
  public readonly company?: string;
  public readonly addressLines: ReadonlyArray<string>;
  public readonly cityLocality: string;
  public readonly stateProvince: string;
  public readonly postalCode: string;
  public readonly country: Country;
  public readonly isResidential?: boolean;

  public constructor(config: AddressConfig) {
    assert.type.object(config, "address");
    super(config, false);

    this.company = config.company === undefined ? undefined
      : assert.string.nonWhitespace(config.company, "company name");
    this.addressLines = assert.array.nonEmpty(config.addressLines, "address lines")
      .map((line) => assert.string.nonWhitespace(line, "address line"));
    this.cityLocality = assert.string.nonWhitespace(config.cityLocality, "city/locality");
    this.stateProvince = assert.string.nonWhitespace(config.stateProvince, "state/province");
    this.postalCode = assert.string.nonWhitespace(config.postalCode, "postal code");
    this.country = assert.string.enum(config.country, Country, "country");
    this.isResidential = config.isResidential === undefined ? undefined
      : assert.type.boolean(config.isResidential, "isResidential flag");

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.addressLines);
  }

  /**
   * Returns the formatted address
   */
  public toString(): string {
    let address = [this.name.toString()];
    this.company && address.push(this.company);
    address.push(...this.addressLines);
    address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
    address.push(this.country);
    return address.join("\n");
  }
}
