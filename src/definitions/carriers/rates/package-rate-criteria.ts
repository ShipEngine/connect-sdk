import type { Dimensions, MonetaryValue, Weight } from "../../common";
import type { DeliveryConfirmation } from "../delivery-confirmation";
import type { Packaging } from "../packaging";

/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteria {
  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  packaging: Array<Packaging>;

  /**
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  deliveryConfirmations: Array<DeliveryConfirmation>;

  /**
   * The package dimensions
   */
  dimensions?: Dimensions;

  /**
   * The package weight
   */
  weight?: Weight;

  /**
   * The insured value of this package
   */
  insuredValue?: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  isNonMachinable: boolean;
}
