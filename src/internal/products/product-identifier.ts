import { ProductIdentifier as IProductIdentifier, ProductIdentifierPOJO } from "../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";


export class ProductIdentifier implements IProductIdentifier {
  public static readonly [_internal] = {
    label: "product",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).required(),
      sku: Joi.string().singleLine().allow(""),
      upc: Joi.string().singleLine().allow(""),
      isbn: Joi.string().singleLine().allow(""),
      asin: Joi.string().singleLine().allow(""),
      fulfillmentSku: Joi.string().singleLine().allow(""),
      inventoryID: Joi.string().trim().singleLine().allow(""),
      identifiers: Identifiers[_internal].schema,
      details: Identifiers[_internal].schema,
    }),
  };

  public readonly id: string;
  public readonly sku: string;
  public readonly upc: string;
  public readonly isbn: string;
  public readonly asin: string;
  public readonly fulfillmentSku: string;
  public readonly inventoryID: string;
  public readonly identifiers: Identifiers;
  public readonly details: Identifiers;

  public constructor(pojo: ProductIdentifierPOJO) {
    this.id = pojo.id;
    this.sku = pojo.sku || "";
    this.upc = pojo.upc || "";
    this.isbn = pojo.isbn || "";
    this.asin = pojo.asin || "";
    this.fulfillmentSku = pojo.fulfillmentSku || "";
    this.inventoryID = pojo.inventoryID || "";
    this.details = new Identifiers(pojo.details)
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
