import { Dimensions } from "../dimensions";
import { Identifier, UUID } from "../types";
import { Weight } from "../weight";
import { MonetaryValueConfig } from "./measures-config";
import { PackageItemConfig } from "./package-item-config";

/**
 * A package that has already been created and assigned identifiers
 */
export type PackageConfig = PackageIdentifierConfig & NewPackageConfig;

/**
 * Identifies a package
 */
export interface PackageIdentifierConfig {
  /**
   * The carrier tracking number
   */
  trackingNumber: string;

  /**
   * Alternative identifiers associated with this package
   */
  identifiers?: Identifier[];
}

/**
 * A package that has not yet been created and has no identifiers yet
 */
export interface NewPackageConfig {
  /**
   * The ID of the packaging used
   */
  packagingID: UUID;

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
  insuredValue?: MonetaryValueConfig;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachineable?: boolean;

  /**
   * Customized strings the end user expects to appear on their label.
   * The exact location on the label depends on the carrier. Some carriers
   * may limit the number of allowed label messages, or not support them at all.
   */
  labelMessages?: string[];

  /**
   * Describes the items inside the package
   */
  contents?: PackageItemConfig[];
}
