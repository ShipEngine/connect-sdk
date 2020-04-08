import { ServiceArea } from "../enums";
import { UUID } from "../types";

/**
 * Describes a type of packaging
 */
export interface PackagingConfig {
  /**
   * A UUID that uniquely identifies the packaging.
   * This ID should never change, even if the packaging name changes.
   */
  id: UUID;

  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  description?: string;

  /**
   * The service area this packaging can be shipped to
   */
  serviceArea?: ServiceArea;

  /**
   * Indicates whether this packaging is delivered using multiple carrier services
   */
  isConsolidator?: boolean;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  requiresWeight?: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  requiresDimensions?: boolean;
}
