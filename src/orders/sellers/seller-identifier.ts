// tslint:disable: max-classes-per-file
import { Identifiers, IdentifiersPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";


/**
 * Identifies a seller who sells goods in a marketplace
 */
export interface SellerIdentifierPOJO {
  /**
   * The marketplace's unique ID for the seller
   */
  id: string;

  /**
   * Your own identifiers for this seller
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Aabstract base class for seller identity
 */
export abstract class SellerIdentifierBase {
  //#region Public Fields

  /**
   * The marketplace's unique ID for the seller
   */
  public readonly id: string;

  /**
   * Your own identifiers for this seller
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: SellerIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


/**
 * Identifies a seller who sells goods in a marketplace
 */
export class SellerIdentifier extends SellerIdentifierBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "seller",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: SellerIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SellerIdentifier);
