import { Address as IAddress, AddressPOJO, Country } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { PartialAddress, PartialAddressBase } from "./partial-address";

export abstract class AddressBase extends PartialAddressBase implements IAddress {
  public readonly country!: Country;

  public toString(): string {
    const address = [];
    this.company && address.push(this.company);
    this.addressLines && address.push(...this.addressLines);
    this.cityLocality && this.stateProvince && address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
    address.push(this.country);
    return address.join("\n");
  }
}


export class Address extends AddressBase {
  public static readonly [_internal] = {
    label: "address",
    schema: PartialAddress[_internal].schema.keys({
      addressLines: Joi.array().items(Joi.string().max(100).allow("").optional()).optional(),
      cityLocality: Joi.string().max(100).allow("").optional(),
      stateProvince: Joi.string().max(100).allow("").optional(),
      postalCode: Joi.string().max(100).required(),
      country: Joi.string().enum(Country).required()
    }),
  };

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
