// tslint:disable: max-classes-per-file
import { Packaging } from ".";
import { Currency } from "../../enums";
import { Constructor } from "../../internal-types";
import { NewPackagePOJO, PackageIdentifierPOJO, PackagePOJO } from "../../pojos/carrier";
import { Joi } from "../../validation";
import { App } from "../common/app";
import { Identifier } from "../common/custom-data";
import { Dimensions } from "../common/dimensions";
import { MonetaryValue } from "../common/monetary-value";
import { Weight } from "../common/weight";
import { PackageItem } from "./package-item";

/**
 * Identifies a package
 */
export class PackageIdentifier extends packageIdentifierMixin() {
  //#region Class Fields

  public static readonly label = "package";

  /** @internal */
  public static readonly schema = Joi.object({
    trackingNumber: Joi.string().trim().singleLine().min(1).max(100).required(),
    identifiers: Joi.array().items(Identifier.schema),
  });

  //#endregion

  public constructor(pojo: PackageIdentifierPOJO) {
    super(pojo);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}

function packageIdentifierMixin(base: Constructor = Object) {
  return class PackageIdentifierMixin extends base {
    //#region Instance Fields

    /**
     * The carrier tracking number
     */
    public readonly trackingNumber: string;

    /**
     * Alternative identifiers associated with this package
     */
    public readonly identifiers: ReadonlyArray<Identifier>;

    //#endregion

    public constructor(pojo: PackageIdentifierPOJO) {
      base === Object ? super() : super(pojo);

      this.trackingNumber = pojo.trackingNumber;
      this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];

      // Prevent modifications after validation
      Object.freeze(this.identifiers);
    }
  };
}


/**
 * A package that has not yet been created and has no identifiers yet
 */
export class NewPackage extends newPackageMixin() {
  //#region Class Fields

  public static readonly label = "package";

  /** @internal */
  public static readonly schema = Joi.object({
    packagingID: Joi.string().uuid().required(),
    dimensions: Dimensions.schema,
    weight: Weight.schema,
    insuredValue: MonetaryValue.schema,
    containsAlcohol: Joi.boolean(),
    isNonMachineable: Joi.boolean(),
    labelMessages: Joi.array().items(Joi.string().trim().singleLine().allow("").max(100)),
    contents: Joi.array().items(PackageItem.schema),
  });

  //#endregion

  public constructor(pojo: NewPackagePOJO, app: App) {
    super(pojo, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}


function newPackageMixin(base: Constructor = Object) {
  return class NewPackageMixin extends base {
    //#region Instance Fields

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

    //#endregion

    public constructor(pojo: NewPackagePOJO, app: App) {
      base === Object ? super() : super(pojo);

      this.packaging = app._references.lookup(pojo.packagingID, Packaging);
      this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
      this.weight = pojo.weight && new Weight(pojo.weight);
      this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
      this.containsAlcohol = pojo.containsAlcohol || false;
      this.isNonMachineable = pojo.isNonMachineable || false;
      this.labelMessages = pojo.labelMessages || [];
      this.contents = (pojo.contents || []).map((item) => new PackageItem(item));

      // Prevent modifications after validation
      Object.freeze(this.labelMessages);
      Object.freeze(this.contents);
    }
  };
}


/**
 * A package that has already been created and assigned identifiers
 */
export interface Package extends PackageIdentifier, NewPackage {}

/**
 * A package that has already been created and assigned identifiers
 */
export class Package extends newPackageMixin(packageIdentifierMixin()) {
  //#region Class Fields

  public static readonly label = "package";

  /** @internal */
  public static readonly schema = PackageIdentifier.schema.concat(NewPackage.schema);

  //#endregion

  public constructor(pojo: PackagePOJO, app: App) {
    super(pojo, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
