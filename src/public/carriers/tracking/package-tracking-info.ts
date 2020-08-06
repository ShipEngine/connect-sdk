import type { DimensionsPOJO, WeightPOJO } from "../../common";
import type { PackagingIdentifierPOJO } from "../packaging";

/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfo {
  /**
   * The actual packaging that was used, as determined by the carrier
   */
  packaging?: PackagingIdentifierPOJO | string;

  /**
   * The actual package dimensions as measured by the carrier
   */
  dimensions?: DimensionsPOJO;

  /**
   * The actual package weight as measured by the carrier
   */
  weight?: WeightPOJO;
}
