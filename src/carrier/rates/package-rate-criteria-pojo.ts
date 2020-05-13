import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../../common";
import { UUID } from "../../types";

/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteriaPOJO {
  /**
   * The IDs of the packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  packaging?: UUID[];

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
  isNonMachineable?: boolean;
}
