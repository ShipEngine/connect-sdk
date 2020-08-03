import type { DeliveryConfirmation } from "../delivery-confirmation";
import type { Packaging } from "../packaging";

/**
 * The package information for a rate
 */
export interface RatePackage {
  /**
   * The packaging this rate is for
   */
  packaging: Packaging;

  /**
   * The delivery confirmation included in this rate
   */
  deliveryConfirmation?: DeliveryConfirmation;
}
