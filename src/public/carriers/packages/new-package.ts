import type { Dimensions, MonetaryValue, Weight } from "../../common";
import { Customs } from "../customs/customs";
import type { NewLabel } from "../documents/new-label";
import type { Packaging } from "../packaging";
import type { PackageItem } from "./package-item";

/**
 * The package information needed when creating a new shipment
 */
export interface NewPackage {
  /**
   * The packaging used
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
  readonly insuredValue: MonetaryValue;

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
   * Label preferences for this package
   */
  readonly label: NewLabel;

  /**
   * Customs declarations for this package
   */
  readonly customs: Customs;

  /**
   * Describes the items inside the package
   */
  readonly contents: readonly PackageItem[];
}
