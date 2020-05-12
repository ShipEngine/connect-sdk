// tslint:disable: max-classes-per-file
import { Country } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { AddressPOJO } from "../../../pojos/common";
import { GeoCoordinate } from "./geo-coordinate";

/**
 * The abstract base class for all address classes
 */
export abstract class BaseAddress {
  public readonly company: string;
  public readonly addressLines: ReadonlyArray<string>;
  public readonly cityLocality: string;
  public readonly stateProvince: string;
  public readonly postalCode: string;
  public readonly country?: Country;
  public readonly timeZone?: string;
  public readonly isResidential?: boolean;
  public readonly coordinates?: GeoCoordinate;

  public constructor(pojo: Partial<AddressPOJO>) {
    this.company = pojo.company || "";
    this.addressLines = pojo.addressLines || [];
    this.cityLocality = pojo.cityLocality || "";
    this.stateProvince = pojo.stateProvince || "";
    this.postalCode = pojo.postalCode || "";
    this.country = pojo.country;
    this.timeZone = pojo.timeZone;
    this.isResidential = pojo.isResidential;
    this.coordinates = pojo.coordinates && new GeoCoordinate(pojo.coordinates);
  }
}

/**
 * A partial mailing address
 */
export class PartialAddress extends BaseAddress {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "address",
    schema: Joi.object({
      company: Joi.string().trim().singleLine().allow("").max(100),
      addressLines: Joi.array().items(Joi.string().trim().singleLine().min(1).max(100)),
      cityLocality: Joi.string().trim().singleLine().max(100),
      stateProvince: Joi.string().trim().singleLine().max(100),
      postalCode: Joi.string().trim().singleLine().max(100),
      country: Joi.string().enum(Country),
      timeZone: Joi.string().timeZone(),
      isResidential: Joi.boolean(),
      coordinates: GeoCoordinate[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: Partial<AddressPOJO>) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PartialAddress);
