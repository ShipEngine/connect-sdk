import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { RateCriteriaPackagePOJO } from "../../../pojos/carrier";
import { Dimensions, MonetaryValue, Weight } from "../../common";


/**
 * The package details needed for a rate quote
 */
export class RateCriteriaPackage {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
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

  public constructor(pojo: RateCriteriaPackagePOJO) {
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
hideAndFreeze(RateCriteriaPackage);
