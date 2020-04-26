// tslint:disable: max-classes-per-file
import { Country } from "../../countries";
import { Constructor } from "../../internal-types";
import { AddressPOJO, AddressWithContactInfoPOJO, GeoCoordinatePOJO } from "../../pojos/common";
import { Joi } from "../../validation";
import { ContactInfo, contactInfoMixin } from "./contact-info";

/**
 * The geo coordinates of a location on Earth
 */
export class GeoCoordinate {
  //#region Class Fields

  public static readonly label = "geo coordinate";

  /** @internal */
  public static readonly schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  });

  //#endregion
  //#region Instance Fields

  public readonly latitude: number;
  public readonly longitude: number;

  //#endregion

  public constructor(pojo: GeoCoordinatePOJO) {
    this.latitude = pojo.latitude;
    this.longitude = pojo.longitude;

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

/**
 * A mailing address
 */
export class Address extends addressMixin() {
  //#region Class Fields

  public static readonly label = "address";

  /** @internal */
  public static readonly schema = Joi.object({
    company: Joi.string().trim().singleLine().allow("").max(100),
    addressLines: Joi.array().min(1).items(Joi.string().trim().singleLine().min(1).max(100)).required(),
    cityLocality: Joi.string().trim().singleLine().min(1).max(100).required(),
    stateProvince: Joi.string().trim().singleLine().min(1).max(100).required(),
    postalCode: Joi.string().trim().singleLine().min(1).max(100).required(),
    country: Joi.string().enum(Country).required(),
    isResidential: Joi.boolean(),
    coordinates: GeoCoordinate.schema,
  });

  //#endregion

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

function addressMixin(base: Constructor = Object) {
  return class AddressMixin extends base {
    //#region Instance Fields

    public readonly company: string;
    public readonly addressLines: ReadonlyArray<string>;
    public readonly cityLocality: string;
    public readonly stateProvince: string;
    public readonly postalCode: string;
    public readonly country: Country;
    public readonly isResidential?: boolean;
    public readonly coordinates?: GeoCoordinate;

    //#endregion

    public constructor(pojo: AddressPOJO) {
      base === Object ? super() : super(pojo);

      this.company = pojo.company || "";
      this.addressLines = pojo.addressLines;
      this.cityLocality = pojo.cityLocality;
      this.stateProvince = pojo.stateProvince;
      this.postalCode = pojo.postalCode;
      this.country = pojo.country;
      this.isResidential = pojo.isResidential;
      this.coordinates = pojo.coordinates && new GeoCoordinate(pojo.coordinates);

      // Prevent modifications after validation
      Object.freeze(this.addressLines);
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
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfo extends Address, ContactInfo {}

/**
 * A mailing address with a person's contact info
 */
export class AddressWithContactInfo extends addressMixin(contactInfoMixin()) {
  //#region Class Fields

  public static readonly label = "address";

  /** @internal */
  public static readonly schema = Address.schema.concat(ContactInfo.schema);

  //#endregion

  public constructor(pojo: AddressWithContactInfoPOJO) {
    super(pojo);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
