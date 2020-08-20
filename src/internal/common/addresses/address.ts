import { Address as IAddress, AddressPOJO, Country } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { PartialAddress, PartialAddressBase } from "./partial-address";

export abstract class AddressBase extends PartialAddressBase implements IAddress {
  public readonly country!: Country;

  public toString(): string {
    const address = [];
    this.company && address.push(this.company);
    address.push(...this.addressLines);
    address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
    address.push(this.country);
    return address.join("\n");
  }
}


export class Address extends AddressBase {
  public static readonly [_internal] = {
    label: "address",
    schema: PartialAddress[_internal].schema.keys({
      addressLines: Joi.array().min(1).items(Joi.string().trim().singleLine().min(1).max(100)).required(),
      cityLocality: Joi.string().trim().singleLine().min(1).max(100).required(),
      stateProvince: Joi.string().trim().singleLine().min(1).max(100).required(),
      postalCode: Joi.string().trim().singleLine().min(1).max(100).required(),
      country: Joi.string().enum(Country).required()
    }),
  };

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
