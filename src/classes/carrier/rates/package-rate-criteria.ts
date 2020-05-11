import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { PackageRateCriteriaPOJO } from "../../../pojos/carrier";
import { Dimensions, MonetaryValue, Weight } from "../../common";
import { App } from "../../common/app";
import { Packaging } from "../packaging";


/**
 * The package details needed for a rate quote
 */
export class PackageRateCriteria {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.array().items(Joi.string().uuid()),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachineable: Joi.boolean(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The packaging that may be used. If not specified, then rate quotes should be
   * returned for all applicable packaging.
   */
  public readonly packaging: ReadonlyArray<Packaging>;

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
  public readonly insuredValue?: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  public readonly containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  public readonly isNonMachineable: boolean;

  //#endregion

  public constructor(pojo: PackageRateCriteriaPOJO, app: App) {
    this.packaging = (pojo.packaging || [])
      .map((id) => app[_internal].references.lookup(id, Packaging));
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachineable = pojo.isNonMachineable || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageRateCriteria);
