import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../../common";
import { DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation-pojo";
import { PackagingIdentifierPOJO } from "../packaging-pojo";

/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteriaPOJO {
  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  packaging?: ReadonlyArray<PackagingIdentifierPOJO>;

  /**
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  deliveryConfirmations?: ReadonlyArray<DeliveryConfirmationIdentifierPOJO>;

  /**
   * The package dimensions
   */
  dimensions?: DimensionsPOJO;

  /**
   * The package weight
   */
  weight?: WeightPOJO;

  /**
   * The insured value of this package.
   * If specified, then rate quotes should include carrier-provided insurance.
   */
  insuredValue?: MonetaryValuePOJO;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachinable?: boolean;
}
