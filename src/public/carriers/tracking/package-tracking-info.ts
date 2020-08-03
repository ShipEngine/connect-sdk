import type { Dimensions, Weight } from "../../common";
import type { Packaging } from "../packaging";

/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfo {
  /**
   * The ID of the actual packaging that was used, as determined by the carrier
   */
  packaging?: Packaging;

  /**
   * The actual package dimensions as measured by the carrier
   */
  dimensions?: Dimensions;

  /**
   * The actual package weight as measured by the carrier
   */
  weight?: Weight;
}
