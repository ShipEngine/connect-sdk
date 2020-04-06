import { Dimensions, Weight } from "../measures";
import { Identifier, UUID } from "../types";

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
}
