import { Identifiers, IdentifiersPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../internal";


/**
 * Identifies a product
 */
export interface ProductIdentifierPOJO {
  /**
   * The vendor's unique ID for the order
   */
  productID: string;

  /**
   * Custom identifiers for this product
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
      productID: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The vendor's unique ID for the product
   */
  public readonly productID: string;

  /**
   * Custom identifiers for this product
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: ProductIdentifierPOJO) {
    this.productID = pojo.productID;
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ProductIdentifier);
