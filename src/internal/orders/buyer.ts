import { Buyer as IBuyer, BuyerPOJO } from "../../public";
import { Address, ContactInfo, ContactInfoBase, hideAndFreeze, Joi, _internal } from "../common";

export class Buyer extends ContactInfoBase implements IBuyer {
  public static readonly [_internal] = {
    label: "buyer",
    schema: ContactInfo[_internal].schema.keys({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      address: Address[_internal].schema
    })
  };

  public readonly id: string;
  public readonly address?: Address;

  public constructor(pojo: BuyerPOJO) {
    super(pojo);

    this.id = pojo.id;
    this.address = pojo.address && new Address(pojo.address);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
