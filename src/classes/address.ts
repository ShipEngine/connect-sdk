// tslint:disable: max-classes-per-file
import { assert } from "../assert";
import { Country } from "../countries";
import { Constructor } from "../internal-types";
import { AddressPOJO, AddressWithContactInfoPOJO, GeoCoordinatePOJO } from "../pojos";
import { ContactInfo, contactInfoMixin } from "./contact-info";

/**
 * A mailing address
 */
export class Address extends addressMixin() {
  public constructor(pojo: AddressPOJO) {
    super(pojo, false);
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
  public constructor(pojo: AddressWithContactInfoPOJO) {
    super(pojo, false);
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
    public readonly coordinates?: GeoCoordinate;

    public constructor(pojo: AddressPOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "address");
      this.company = pojo.company === undefined ? undefined
        : assert.string.nonWhitespace(pojo.company, "company name");
      this.addressLines = assert.array.nonEmpty(pojo.addressLines, "address lines")
        .map((line) => assert.string.nonWhitespace(line, "address line"));
      this.cityLocality = assert.string.nonWhitespace(pojo.cityLocality, "city/locality");
      this.stateProvince = assert.string.nonWhitespace(pojo.stateProvince, "state/province");
      this.postalCode = assert.string.nonWhitespace(pojo.postalCode, "postal code");
      this.country = assert.string.enum(pojo.country, Country, "country");
      this.isResidential = pojo.isResidential === undefined ? undefined
        : assert.type.boolean(pojo.isResidential, "isResidential flag");
      this.coordinates = pojo.coordinates === undefined ? undefined
        : new GeoCoordinate(pojo.coordinates);

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

/**
 * The geo coordinates of a location on Earth
 */
export class GeoCoordinate {
  public readonly latitude: number;
  public readonly longitude: number;

  public constructor(pojo: GeoCoordinatePOJO) {
    assert.type.object(pojo, "coordinates");
    this.latitude = assert.number(pojo.latitude, "latitude");
    this.longitude = assert.number(pojo.longitude, "longitude");

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
