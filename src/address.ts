// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { AddressConfig, AddressWithContactInfoConfig } from "./config";
import { ContactInfo, contactInfoMixin } from "./contact-info";
import { Country } from "./countries";
import { Constructor } from "./types";

/**
 * A mailing address
 */
export class Address extends addressMixin() {
  public constructor(config: AddressConfig) {
    super(config, false);
  }
}

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfo extends Address, ContactInfo {}

/**
 * A mailing address with a person's contact info
 */
export class AddressWithContactInfo extends addressMixin(contactInfoMixin()) {
  public constructor(config: AddressWithContactInfoConfig) {
    super(config, false);
  }
}


function addressMixin(base: Constructor = Object) {
  return class AddressMixin extends base {
    public readonly company?: string;
    public readonly addressLines: ReadonlyArray<string>;
    public readonly cityLocality: string;
    public readonly stateProvince: string;
    public readonly postalCode: string;
    public readonly country: Country;
    public readonly isResidential?: boolean;

    public constructor(config: AddressConfig, isMixin: boolean) {
      base === Object ? super() : super(config, isMixin);
      assert.type.object(config, "address");
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
      Object.freeze(this.addressLines);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }

    /**
     * Returns the formatted address
     */
    public toString(): string {
      let address = [];
      this.company && address.push(this.company);
      address.push(...this.addressLines);
      address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
      address.push(this.country);
      return address.join("\n");
    }
  };
}
