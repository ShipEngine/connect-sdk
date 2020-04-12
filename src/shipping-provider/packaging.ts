import { App } from "../app";
import { assert } from "../assert";
import { PackagingConfig } from "../config";
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
  public constructor(app: App, config: PackagingConfig) {
    assert.type.object(config, "packaging");
    this.id = app._references.add(this, config, "packaging");
    this.name = assert.string.nonWhitespace(config.name, "packaging name");
    this.description = assert.string(config.description, "packaging description", "");
    this.requiresWeight = assert.type.boolean(config.requiresWeight, "requiresWeight flag", false);
    this.requiresDimensions = assert.type.boolean(config.requiresDimensions, "requiresDimensions flag", false);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
