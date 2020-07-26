import { Buyer as IBuyer, BuyerPOJO } from "../../public";
import { ContactInfo, ContactInfoBase, hideAndFreeze, Joi, _internal } from "../common";

export class Buyer extends ContactInfoBase implements IBuyer {
  public static readonly [_internal] = {
    label: "buyer",
    schema: ContactInfo[_internal].schema.keys({
      id: Joi.string().trim().singleLine().min(1).max(100).required()
    }),
  };

  public readonly id: string;

  public constructor(pojo: BuyerPOJO) {
    super(pojo);

    this.id = pojo.id;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
