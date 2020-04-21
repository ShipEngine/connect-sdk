// tslint:disable: max-classes-per-file
import { App } from "./app";
import { assert } from "./assert";
import { NewPackageConfig, PackageConfig, PackageIdentifierConfig } from "./config";
import { PackageItemConfig } from "./config/package-item-config";
import { Dimensions } from "./dimensions";
import { Currency, MonetaryValue } from "./monetary-value";
import { PackageItem } from "./package-item";
import { Packaging } from "./shipping-provider";
import { Constructor, Identifier } from "./types";
import { Weight } from "./weight";

/**
 * Identifies a package
 */
export class PackageIdentifier extends packageIdentifierMixin() {
  public constructor(config: PackageIdentifierConfig) {
    super(config, false);
  }
}

/**
 * A package that has not yet been created and has no identifiers yet
 */
export class NewPackage extends newPackageMixin() {
  public constructor(app: App, config: NewPackageConfig) {
    super(app, config, false);
  }
}

/**
 * A package that has already been created and assigned identifiers
 */
export interface Package extends PackageIdentifier, NewPackage {}

/**
 * A package that has already been created and assigned identifiers
 */
export class Package extends newPackageMixin(packageIdentifierMixin()) {
  public constructor(app: App, config: PackageConfig) {
    super(app, config, true);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}


function packageIdentifierMixin(base: Constructor = Object) {
  return class PackageIdentifierMixin extends base {
    /**
     * The carrier tracking number
     */
    public readonly trackingNumber: string;

    /**
     * Alternative identifiers associated with this package
     */
    public readonly identifiers: ReadonlyArray<Identifier>;

    public constructor(config: PackageIdentifierConfig, isMixin: boolean) {
      base === Object ? super() : super(config, isMixin);
      assert.type.object(config, "package");
      this.trackingNumber = assert.string.nonWhitespace(config.trackingNumber, "tracking number");
      this.identifiers = assert.array.ofIdentifiers(config.identifiers, "package identifiers", []);

      // Prevent modifications after validation
      Object.freeze(this.identifiers);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}

function newPackageMixin(base: Constructor = Object) {
  return class NewPackageMixin extends base {
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

    /**
     * The insured value of this package
     */
    public readonly insuredValue: MonetaryValue;

    /**
     * Indicates whether the package contains alcohol
     */
    public readonly containsAlcohol: boolean;

    /**
     * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
     * and requires manual handling.
     */
    public readonly isNonMachineable: boolean;

    /**
     * Customized strings the end user expects to appear on their label.
     * The exact location on the label depends on the carrier. Some carriers
     * may limit the number of allowed label messages, or not support them at all.
     */
    public readonly labelMessages: ReadonlyArray<string>;

    /**
     * Describes the items inside the package
     */
    public readonly contents: ReadonlyArray<PackageItem>;

    public constructor(app: App, config: NewPackageConfig, isMixin: boolean) {
      base === Object ? super() : super(config, isMixin);
      assert.type.object(config, "package");
      this.packaging = app._references.lookup(config.packagingID, Packaging, "packaging");
      this.dimensions = (config.dimensions || this.packaging.requiresDimensions)
        ? new Dimensions(config.dimensions!) : undefined;
      this.weight = (config.weight || this.packaging.requiresWeight)
        ? new Weight(config.weight!) : undefined;
      this.insuredValue = new MonetaryValue(config.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
      this.containsAlcohol = assert.type.boolean(config.containsAlcohol, "containsAlcohol flag", false);
      this.isNonMachineable = assert.type.boolean(config.isNonMachineable, "isNonMachineable flag", false);
      this.labelMessages = assert.array(config.labelMessages, "label messages", [])
        .map((message) => assert.string(message, "label message"));
      this.contents = assert.array(config.contents, "package contents", [])
        .map((item: PackageItemConfig) => new PackageItem(item));

      // Prevent modifications after validation
      Object.freeze(this.labelMessages);
      Object.freeze(this.contents);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}
