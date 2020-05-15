import { App, Dimensions, MonetaryValue, Weight } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { Packaging } from "../packaging";
import { PackageRateCriteriaPOJO } from "./package-rate-criteria-pojo";


/**
 * The package details needed for a rate quote
 */
export class PackageRateCriteria {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packagingIDs: Joi.array().items(Joi.string().uuid()),
      deliveryConfirmationIDs: Joi.array().items(Joi.string().uuid()),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
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
   * The delivery confirmations that may be used. If not specified, then rate quotes
   * should be returned for all applicable delivery confirmations.
   */
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

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
  public readonly isNonMachinable: boolean;

  //#endregion

  public constructor(pojo: PackageRateCriteriaPOJO, app: App) {
    this.packaging = (pojo.packagingIDs || [])
      .map((id) => app[_internal].references.lookup(id, Packaging));
    this.deliveryConfirmations = (pojo.deliveryConfirmationIDs || [])
      .map((id) => app[_internal].references.lookup(id, DeliveryConfirmation));
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageRateCriteria);
