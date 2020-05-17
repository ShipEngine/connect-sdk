import { Identifiers, IdentifiersPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";


/**
 * Identifies a seller who sells goods on a marketplace
 */
export interface SellerIdentifierPOJO {
  /**
   * The marketplace's unique ID for the seller
   */
  sellerID: string;

  /**
   * Custom identifiers for this seller
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Identifies a seller who sells goods on a marketplace
 */
export class SellerIdentifier {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "seller",
    schema: Joi.object({
      sellerID: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The marketplace's unique ID for the seller
   */
  public readonly sellerID: string;

  /**
   * Custom identifiers for this seller
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: SellerIdentifierPOJO) {
    this.sellerID = pojo.sellerID;
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SellerIdentifier);
