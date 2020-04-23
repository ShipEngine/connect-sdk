// tslint:disable: max-classes-per-file
import { assert } from "../assert";
import { Currency } from "../enums";
import { Constructor } from "../internal-types";
import { NewPackagePOJO, PackageIdentifierPOJO, PackageItemPOJO, PackagePOJO } from "../pojos";
import { Identifier } from "../types";
import { App } from "./app";
import { Packaging } from "./carrier";
import { Dimensions } from "./dimensions";
import { MonetaryValue } from "./monetary-value";
import { PackageItem } from "./package-item";
import { Weight } from "./weight";

/**
 * Identifies a package
 */
export class PackageIdentifier extends packageIdentifierMixin() {
  public constructor(pojo: PackageIdentifierPOJO) {
    super(pojo, false);
  }
}

/**
 * A package that has not yet been created and has no identifiers yet
 */
export class NewPackage extends newPackageMixin() {
  public constructor(app: App, pojo: NewPackagePOJO) {
    super(app, pojo, false);
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
  public constructor(app: App, pojo: PackagePOJO) {
    super(app, pojo, true);

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

    public constructor(pojo: PackageIdentifierPOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "package");
      this.trackingNumber = assert.string.nonWhitespace(pojo.trackingNumber, "tracking number");
      this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "package identifiers", []);

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

    public constructor(app: App, pojo: NewPackagePOJO, isMixin: boolean) {
      base === Object ? super() : super(pojo, isMixin);
      assert.type.object(pojo, "package");
      this.packaging = app._references.lookup(pojo.packagingID, Packaging, "packaging");
      this.dimensions = (pojo.dimensions || this.packaging.requiresDimensions)
        ? new Dimensions(pojo.dimensions!) : undefined;
      this.weight = (pojo.weight || this.packaging.requiresWeight)
        ? new Weight(pojo.weight!) : undefined;
      this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
      this.containsAlcohol = assert.type.boolean(pojo.containsAlcohol, "containsAlcohol flag", false);
      this.isNonMachineable = assert.type.boolean(pojo.isNonMachineable, "isNonMachineable flag", false);
      this.labelMessages = assert.array(pojo.labelMessages, "label messages", [])
        .map((message) => assert.string(message, "label message"));
      this.contents = assert.array(pojo.contents, "package contents", [])
        .map((item: PackageItemPOJO) => new PackageItem(item));

      // Prevent modifications after validation
      Object.freeze(this.labelMessages);
      Object.freeze(this.contents);

      // Don't freeze the base object yet if this is a mixin
      isMixin || Object.freeze(this);
    }
  };
}
