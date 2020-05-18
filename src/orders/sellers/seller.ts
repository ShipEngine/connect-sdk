import { ContactInfo, ContactInfoPOJO } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { SellerIdentifier, sellerIdentifierMixin, SellerIdentifierPOJO } from "./seller-identifier";
import { Store, StorePOJO } from "./store";


/**
 * A seller who sells goods in a marketplace
 */
export interface SellerPOJO extends SellerIdentifierPOJO {
  /**
   * The store in the marketplace where the seller sells their goods
   */
  store: StorePOJO;

  /**
   * Contact information for the seller
   */
  contact?: ContactInfoPOJO;

  /**
   * Arbitrary data about this seller that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata?: object;
}


/**
 * A seller who sells goods in a marketplace
 */
export class Seller extends sellerIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "seller",
    schema: SellerIdentifier[_internal].schema.keys({
      store: Store[_internal].schema.required(),
      contact: ContactInfo[_internal].schema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The store in the marketplace where the seller sells their goods
   */
  public readonly store: Store;

  /**
   * Contact information for the seller
   */
  public readonly contact?: ContactInfo;

  /**
   * Arbitrary data about this seller that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: SellerPOJO) {
    super(pojo);

    this.store = new Store(pojo.store);
    this.contact = pojo.contact && new ContactInfo(pojo.contact);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Seller);
