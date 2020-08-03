import { Country, PartialAddress as IPartialAddress, PartialAddress as PartialAddressPOJO } from "../../../definitions";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";

export abstract class PartialAddressBase implements IPartialAddress {
  public company: string;
  public addressLines: Array<string>;
  public cityLocality: string;
  public stateProvince: string;
  public postalCode: string;
  public country?: Country;
  public isResidential?: boolean;

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
  public static [_internal] = {
    label: "address",
    schema: Joi.object({
      company: Joi.string().trim().singleLine().allow("").max(100),
      addressLines: Joi.array().items(Joi.string().trim().singleLine().min(1).max(100)),
      cityLocality: Joi.string().trim().singleLine().max(100),
      stateProvince: Joi.string().trim().singleLine().max(100),
      postalCode: Joi.string().trim().singleLine().max(100),
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
