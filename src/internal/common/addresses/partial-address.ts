import { Country, PartialAddress as IPartialAddress, PartialAddressPOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { GeoCoordinate } from "./geo-coordinate";

export abstract class PartialAddressBase implements IPartialAddress {
  public readonly company: string;
  public readonly addressLines: ReadonlyArray<string>;
  public readonly cityLocality: string;
  public readonly stateProvince: string;
  public readonly postalCode: string;
  public readonly country?: Country;
  public readonly isResidential?: boolean;
  public readonly coordinates?: GeoCoordinate;

  public constructor(pojo: PartialAddressPOJO) {
    this.company = pojo.company || "";
    this.addressLines = pojo.addressLines || [];
    this.cityLocality = pojo.cityLocality || "";
    this.stateProvince = pojo.stateProvince || "";
    this.postalCode = pojo.postalCode || "";
    this.country = pojo.country;
    this.isResidential = pojo.isResidential;
    this.coordinates = pojo.coordinates && new GeoCoordinate(pojo.coordinates);
  }
}


export class PartialAddress extends PartialAddressBase {
  public static readonly [_internal] = {
    label: "address",
    schema: Joi.object({
      company: Joi.string().trim().singleLine().allow("").max(100),
      addressLines: Joi.array().items(Joi.string().trim().singleLine().min(1).max(100)),
      cityLocality: Joi.string().trim().singleLine().max(100),
      stateProvince: Joi.string().trim().singleLine().max(100),
      postalCode: Joi.string().trim().singleLine().max(100),
      country: Joi.string().enum(Country),
      isResidential: Joi.boolean(),
      coordinates: GeoCoordinate[_internal].schema,
    }),
  };

  public constructor(pojo: PartialAddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
