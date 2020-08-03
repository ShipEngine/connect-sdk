import type { ContactInfo } from "../../common";
import type { SellerIdentifier } from "./seller-identifier";
import type { Store } from "./store";

/**
 * A seller who sells goods in a marketplace
 */
export interface Seller extends SellerIdentifier {
  /**
   * The store in the marketplace where the seller sells their goods
   */
  store: Store;

  /**
   * Contact information for the seller
   */
  contact?: ContactInfo;

  /**
   * Arbitrary data about this seller that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  metadata: object;
}
