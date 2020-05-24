import type { ContactInfo, ContactInfoPOJO } from "../../common";
import type { SellerIdentifier, SellerIdentifierPOJO } from "./seller-identifier";
import type { Store, StorePOJO } from "./store";

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
export interface Seller extends SellerIdentifier {
  /**
   * The store in the marketplace where the seller sells their goods
   */
  readonly store: Store;

  /**
   * Contact information for the seller
   */
  readonly contact?: ContactInfo;

  /**
   * Arbitrary data about this seller that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  readonly metadata: object;
}
