import { assert } from "../../assert";
import { PackagingPOJO } from "../../pojos";
import { UUID } from "../../types";
import { App } from "../app";

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

  public constructor(app: App, pojo: PackagingPOJO) {
    assert.type.object(pojo, "packaging");
    this.id = app._references.add(this, pojo, "packaging");
    this.name = assert.string.nonWhitespace(pojo.name, "packaging name");
    this.description = assert.string(pojo.description, "packaging description", "");
    this.requiresWeight = assert.type.boolean(pojo.requiresWeight, "requiresWeight flag", false);
    this.requiresDimensions = assert.type.boolean(pojo.requiresDimensions, "requiresDimensions flag", false);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
