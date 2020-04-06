// tslint:disable: max-classes-per-file
import { assert } from "./assert";
import { NewPackageConfig, PackageConfig, PackageIdentifierConfig } from "./config";
import { Dimensions, Weight } from "./measures";
import { Packaging, ShippingProviderApp } from "./shipping-provider";
import { Identifier } from "./types";

/**
 * Identifies a package
 */
export class PackageIdentifier {
  /**
   * The carrier tracking number
   */
  public readonly trackingNumber: string;

  /**
   * Alternative identifiers associated with this package
   */
  public readonly identifiers: Identifier[];

  public constructor(config: PackageIdentifierConfig) {
    assert.type.object(config, "package");
    this.trackingNumber = assert.string.nonWhitespace(config.trackingNumber, "tracking number");
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "package identifiers", []);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}

/**
 * A package that has not yet been created and has no identifiers yet
 */
export class NewPackage {
  /**
   * The packaging used
   */
  public readonly packaging: Packaging;

  /**
   * The package dimensions
   */
  public readonly dimensions?: Dimensions;

  /**
   * The package weight
   */
  public readonly weight?: Weight;

  public constructor(app: ShippingProviderApp, config: NewPackageConfig) {
    assert.type.object(config, "package");
    this.packaging = app.getPackaging(config.packagingID);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

/**
 * A package that has already been created and assigned identifiers
 */
export class Package extends NewPackage {
  /**
   * The carrier tracking number
   */
  public readonly trackingNumber!: string;

  /**
   * Alternative identifiers associated with this package
   */
  public readonly identifiers!: Identifier[];

  public constructor(app: ShippingProviderApp, config: PackageConfig) {
    super(app, config);
    PackageIdentifier.call(this, config);
  }
}
