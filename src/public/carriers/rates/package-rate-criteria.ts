import type { Dimensions, DimensionsPOJO, MonetaryValue, MonetaryValuePOJO, Weight, WeightPOJO } from "../../common";
import type { DeliveryConfirmation, DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";
import type { Packaging, PackagingIdentifierPOJO } from "../packaging";


/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteriaPOJO {
  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  packaging?: ReadonlyArray<PackagingIdentifierPOJO | string>;

  /**
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  deliveryConfirmations?: ReadonlyArray<DeliveryConfirmationIdentifierPOJO | string>;

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


/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteria {
  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  /**
   * The package dimensions
   */
  readonly dimensions?: Dimensions;

  /**
   * The package weight
   */
  readonly weight?: Weight;

  /**
   * The insured value of this package
   */
  readonly insuredValue?: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  readonly containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  readonly isNonMachinable: boolean;
}
