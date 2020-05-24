import { SellerIdentifier as ISellerIdentifier, SellerIdentifierPOJO } from "../../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export abstract class SellerIdentifierBase implements ISellerIdentifier {
  public readonly id: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: SellerIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class SellerIdentifier extends SellerIdentifierBase {
  public static readonly [_internal] = {
    label: "seller",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: SellerIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
