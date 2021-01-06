import { AddressPOJO, Country } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export type PartialAddressPOJO = Partial<AddressPOJO>;

export interface PartialAddress {
  readonly company: string;
  readonly addressLines: readonly string[];
  readonly cityLocality: string;
  readonly stateProvince: string;
  readonly postalCode: string;
  readonly country?: Country;
  readonly isResidential?: boolean;
}

export abstract class PartialAddressBase {
  public readonly company: string;
  public readonly addressLines: readonly string[];
  public readonly cityLocality: string;
  public readonly stateProvince: string;
  public readonly postalCode: string;
  public readonly country?: Country;
  public readonly isResidential?: boolean;

  public constructor(pojo: PartialAddressPOJO) {
    this.company = pojo.company || "";
    this.addressLines = pojo.addressLines || [];
    this.cityLocality = pojo.cityLocality || "";
    this.stateProvince = pojo.stateProvince || "";
    this.postalCode = pojo.postalCode || "";
    this.country = pojo.country;
    this.isResidential = pojo.isResidential;
  }
}


export class PartialAddress extends PartialAddressBase {
  public static readonly [_internal] = {
    label: "address",
    schema: Joi.object({
      company: Joi.string().singleLine().allow(""),
      addressLines: Joi.array().items(Joi.string().singleLine().allow("")),
      cityLocality: Joi.string().trim().singleLine().allow(""),
      stateProvince: Joi.string().trim().singleLine().allow(""),
      postalCode: Joi.string().trim().singleLine(),
      country: Joi.string().enum(Country),
      isResidential: Joi.boolean()
    }),
  };

  public constructor(pojo: PartialAddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
