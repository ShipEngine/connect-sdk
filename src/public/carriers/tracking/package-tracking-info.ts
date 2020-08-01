import type { Dimensions, DimensionsPOJO, Weight, WeightPOJO } from "../../common";
import type { Packaging, PackagingIdentifierPOJO } from "../packaging";

/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfoPOJO {
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


/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfo {
  /**
   * The ID of the actual packaging that was used, as determined by the carrier
   */
  readonly packaging?: Packaging;

  /**
   * The actual package dimensions as measured by the carrier
   */
  readonly dimensions?: Dimensions;

  /**
   * The actual package weight as measured by the carrier
   */
  readonly weight?: Weight;
}
