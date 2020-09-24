import type { Dimensions, MonetaryValue, Weight } from "../../common";
import type { Packaging } from "../packaging";
import { Customs } from "../customs/customs";


/**
 * The package details needed for a rate quote
 */
export interface PackageRateCriteria {
  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  readonly packaging?: Packaging | string;

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

  /**
   * Customs declarations for this package
   */
  readonly customs?: Customs;
}
