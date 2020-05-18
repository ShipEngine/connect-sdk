import { Identifiers, IdentifiersPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../common/internal";


/**
 * Identifies a product
 */
export interface ProductIdentifierPOJO {
  /**
   * The product catalog's unique ID for the order
   */
  id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  sku?: string;

  /**
   * Your own identifiers for this product
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a product
 */
export class ProductIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "product",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The product catalog's unique ID for the product
   */
  public readonly id: string;

  /**
   * The Stock Keeping Unit code for this item
   */
  public readonly sku: string;

  /**
   * Your own identifiers for this product
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: ProductIdentifierPOJO) {
    this.id = pojo.id;
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ProductIdentifier);
