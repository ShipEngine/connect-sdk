import { Country } from "../../../enums";
import { Constructor } from "../../../internal-types";
import { AddressPOJO } from "../../../pojos/common";
import { Joi } from "../../../validation";
import { hideAndFreeze, _internal } from "../../utils";
import { GeoCoordinate } from "./geo-coordinate";

/**
 * A mailing address
 */
export class Address extends addressMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "address",
    schema: Joi.object({
      company: Joi.string().trim().singleLine().allow("").max(100),
      addressLines: Joi.array().min(1).items(Joi.string().trim().singleLine().min(1).max(100)).required(),
      cityLocality: Joi.string().trim().singleLine().min(1).max(100).required(),
      stateProvince: Joi.string().trim().singleLine().min(1).max(100).required(),
      postalCode: Joi.string().trim().singleLine().min(1).max(100).required(),
      country: Joi.string().enum(Country).required(),
      isResidential: Joi.boolean(),
      coordinates: GeoCoordinate[_internal].schema,
      timeZone: Joi.string().timeZone(),
    }),
  };

  //#endregion
  //#region Public Fields

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Address);

/**
 * Extends a base class with address fields
 * @internal
 */
export function addressMixin(base: Constructor = Object) {
  return class AddressMixin extends base {
    //#region Public Fields

    public readonly company: string;
    public readonly addressLines: ReadonlyArray<string>;
    public readonly cityLocality: string;
    public readonly stateProvince: string;
    public readonly postalCode: string;
    public readonly country: Country;
    public readonly isResidential?: boolean;
    public readonly coordinates?: GeoCoordinate;
    public readonly timeZone?: string;

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
      this.timeZone = pojo.timeZone;
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
