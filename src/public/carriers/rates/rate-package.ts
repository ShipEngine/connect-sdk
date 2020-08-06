import type { DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";
import type { PackagingIdentifierPOJO } from "../packaging";

/**
 * The package information for a rate
 */
export interface RatePackage {
  /**
   * The packaging this rate is for
   */
  packaging: PackagingIdentifierPOJO | string;

  /**
   * The delivery confirmation included in this rate
   */
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO | string;
}
