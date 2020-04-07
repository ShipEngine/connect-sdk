import { assert } from "../assert";
import { PackagingConfig } from "../config";
import { ServiceArea } from "../enums";
import { UUID } from "../types";

/**
 * Describes a type of packaging
 */
export class Packaging {
  /**
   * A UUID that uniquely identifies the packaging.
   * This ID should never change, even if the packaging name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly name for this packaging (e.g. "Flat-Rate Box", "Large Padded Envelope")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the packaging
   */
  public readonly description: string;

  /**
   * The service area this packaging can be shipped to
   */
  public readonly area: ServiceArea | undefined;

  /**
   * Indicates whether this packaging is delivered using multiple carrier services
   */
  public readonly isConsolidator: boolean;

  /**
   * Indicates whether the weight must be specified when using this packaging
   */
  public readonly requiresWeight: boolean;

  /**
   * Indicates whether the dimensions must be specified when using this packaging
   */
  public readonly requiresDimensions: boolean;

  /**
   * Creates a Packaging object from a fully-resolved config object
   */
  public constructor(config: PackagingConfig) {
    assert.type.object(config, "packaging");
    this.id = assert.string.uuid(config.id, "packaging ID");
    this.name = assert.string.nonWhitespace(config.name, "packaging name");
    this.description = assert.string(config.description, "packaging description", "");
    this.area = config.area && assert.string.enum(config.area, ServiceArea, "packaging area");
    this.isConsolidator = assert.type.boolean(config.isConsolidator, "isConsolidator flag", false);
    this.requiresWeight = assert.type.boolean(config.requiresWeight, "requiresWeight flag", false);
    this.requiresDimensions = assert.type.boolean(config.requiresDimensions, "requiresDimensions flag", false);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
