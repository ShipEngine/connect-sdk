import { ProductIdentifier as IProductIdentifier, ProductIdentifier as ProductIdentifierPOJO } from "../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";


export class ProductIdentifier implements IProductIdentifier {
  public static [_internal] = {
    label: "product",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public id: string;
  public sku: string;
  public identifiers: Identifiers;

  public constructor(pojo: ProductIdentifierPOJO) {
    this.id = pojo.id;
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
