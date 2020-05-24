import { Buyer as IBuyer, BuyerPOJO } from "../../public";
import { ContactInfo, ContactInfoBase, hideAndFreeze, Identifiers, Joi, _internal } from "../common";

export class Buyer extends ContactInfoBase implements IBuyer {
  public static readonly [_internal] = {
    label: "buyer",
    schema: ContactInfo[_internal].schema.keys({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public readonly id: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: BuyerPOJO) {
    super(pojo);

    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
