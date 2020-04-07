import { humanize } from "@jsdevtools/humanize-anything";
import { ono } from "@jsdevtools/ono";
import { assert } from "../assert";
import { PackagingConfig } from "../config";
import { ServiceArea } from "../enums";
import { readArrayConfig, readConfig } from "../read-config";
import { InlineOrReference, InlineOrReferenceArray, UUID } from "../types";
import { getCwd } from "../file-utils";

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

  /**
   * Reads the config for a packaging type
   */
  public static async readConfig(config: InlineOrReference<PackagingConfig>, cwd = "."): Promise<PackagingConfig> {
    try {
      return await readConfig(config, "packaging", cwd);
    }
    catch (error) {
      throw ono(error, `Error reading the packaging config: ${humanize(config)}`);
    }
  }

  /**
   * Reads the config for an array of packaging types
   */
  public static async readArrayConfig(config: InlineOrReferenceArray<PackagingConfig>, cwd = "."): Promise<PackagingConfig[]> {
    try {
      const arrayItemCwd = getCwd(config, cwd);

      const arrayConfig = await readArrayConfig(config, "delivery_services,", cwd);
      const dereferencedArray = [];

      for (let item of arrayConfig) {
        const dereferencedConfig = await Packaging.readConfig(item, arrayItemCwd);
        dereferencedArray.push(dereferencedConfig);
      }
      return dereferencedArray;
    }
    catch (error) {
      throw ono(error, `Error reading the packaging config: ${humanize(config)}`);
    }
  }
}
