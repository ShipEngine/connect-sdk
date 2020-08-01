import type { DeliveryConfirmation, DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";
import type { Packaging, PackagingIdentifierPOJO } from "../packaging";

/**
 * The package information for a rate
 */
export interface RatePackagePOJO {
  /**
   * The packaging this rate is for
   */
  packaging: PackagingIdentifierPOJO | string;

  /**
   * The delivery confirmation included in this rate
   */
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO | string;
}


/**
 * The package information for a rate
 */
export interface RatePackage {
  /**
   * The packaging this rate is for
   */
  readonly packaging: Packaging;

  /**
   * The delivery confirmation included in this rate
   */
  readonly deliveryConfirmation?: DeliveryConfirmation;
}
