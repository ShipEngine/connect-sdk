import { ContactInfoPOJO, Identifiers, IdentifiersPOJO } from "../common";
import { ContactInfo, contactInfoMixin } from "../common/addresses/contact-info";
import { hideAndFreeze, Joi, _internal } from "../common/internal";


/**
 * The person who bought a sales order
 */
export interface BuyerPOJO extends ContactInfoPOJO {
  /**
   * The marketplace's unique ID for the buyer
   */
  id: string;

  /**
   * Your own identifiers for this buyer
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * The person who bought a sales order
 */
export class Buyer extends contactInfoMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "buyer",
    schema: ContactInfo[_internal].schema.keys({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The marketplace's unique ID for the sales order
   */
  public readonly id: string;

  /**
   * Your own identifiers for this sales order
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: BuyerPOJO) {
    super(pojo);

    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Buyer);
