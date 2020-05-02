import { Currency } from "../../../enums";
import { Constructor } from "../../../internal-types";
import { NewPackagePOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { Dimensions, MonetaryValue, Weight } from "../../common";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { Packaging } from "../packaging";
import { PackageItem } from "./package-item";


/**
 * A package that has not yet been created and has no identifiers yet
 */
export class NewPackage extends newPackageMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packagingID: Joi.string().uuid().required(),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachineable: Joi.boolean(),
      labelMessages: Joi.array().items(Joi.string().trim().singleLine().allow("").max(100)),
      contents: Joi.array().items(PackageItem[_internal].schema),
    }),
  };

  //#endregion

  public constructor(pojo: NewPackagePOJO, app: App) {
    super(pojo, app);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewPackage);

/**
 * Extends a base class with the fields of a new package
 * @internal
 */
export function newPackageMixin(base: Constructor = Object) {
  return class NewPackageMixin extends base {
    //#region Public Fields

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

      this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
      this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
      this.weight = pojo.weight && new Weight(pojo.weight);
      this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
      this.containsAlcohol = pojo.containsAlcohol || false;
      this.isNonMachineable = pojo.isNonMachineable || false;
      this.labelMessages = pojo.labelMessages || [];
      this.contents = (pojo.contents || []).map((item) => new PackageItem(item));
    }
  };
}
