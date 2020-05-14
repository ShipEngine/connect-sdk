import { App, Dimensions, MonetaryValue, Weight } from "../../common";
import { Currency, NonDeliveryAction } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { NewLabel } from "../documents/new-label";
import { Packaging } from "../packaging";
import { NewPackagePOJO } from "./new-package-pojo";
import { PackageItem } from "./package-item";


/**
 * The package information needed when creating a new shipment
 */
export class NewPackage {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packagingID: Joi.string().uuid().required(),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      nonDeliveryAction: Joi.string().enum(NonDeliveryAction),
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
      label: NewLabel[_internal].schema.required(),
      contents: Joi.array().items(PackageItem[_internal].schema),
    }),
  };

  //#endregion
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
   * Indicates how a non-deliverable package should be handled. If `undefined`,
   * the carrier's default behavior applies, which may incur charges.
   */
  public readonly nonDeliveryAction?: NonDeliveryAction;

  /**
   * Indicates whether the package contains alcohol
   */
  public readonly containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  public readonly isNonMachinable: boolean;

  /**
   * Label preferences for this package
   */
  public readonly label: NewLabel;

  /**
   * Describes the items inside the package
   */
  public readonly contents: ReadonlyArray<PackageItem>;

  //#endregion

  public constructor(pojo: NewPackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
    this.nonDeliveryAction = pojo.nonDeliveryAction;
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;
    this.label = new NewLabel(pojo.label);
    this.contents = (pojo.contents || []).map((item) => new PackageItem(item));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewPackage);
