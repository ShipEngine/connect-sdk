import { App, Dimensions, MonetaryValue, Weight } from "../../common";
import { Currency, NonDeliveryOption } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { NewLabel } from "../documents/new-label";
import { Packaging } from "../packaging";
import { CustomsItem } from "./customs-item";
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
      deliveryConfirmationID: Joi.string().uuid(),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
      label: NewLabel[_internal].schema.required(),
      contents: Joi.array().items(PackageItem[_internal].schema),
      customs: Joi.object({
        nonDeliveryOption: Joi.string().enum(NonDeliveryOption),
        contents: Joi.array().items(CustomsItem[_internal].schema),
      }),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The packaging used
   */
  public readonly packaging: Packaging;

  /**
   * The requested delivery confirmation
   */
  public readonly deliveryConfirmation?: DeliveryConfirmation;

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
  public readonly isNonMachinable: boolean;

  /**
   * Label preferences for this package
   */
  public readonly label: NewLabel;

  /**
   * Describes the items inside the package
   */
  public readonly contents: ReadonlyArray<PackageItem>;

  /**
   * Customs declarations for this package
   */
  public readonly customs: {
    /**
     * Indicates what should be done if the package cannot be delivered.
     * If `undefined`, the default behavior of the receiving country's customs department applies,
     * which may incur charges.
     */
    nonDeliveryOption?: NonDeliveryOption;

    /**
     * Describes the contents of the package for customs purposes.
     *
     * NOTE: Customs contents may not correspond one-to-one with the package contents.
     * Package contents usually include one item per unique merchandise SKU
     * (e.g. one red t-shirt and one blue t-shirt), whereas customs contentsare often grouped by
     * product type (e.g. two t-shirts). In addition, some package contents don't need to be dclared
     * for customs purposes.
     */
    contents?: ReadonlyArray<CustomsItem>;
  };

  //#endregion

  public constructor(pojo: NewPackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmationID, DeliveryConfirmation);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: Currency.UnitedStatesDollar });
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;
    this.label = new NewLabel(pojo.label);
    this.contents = (pojo.contents || []).map((item) => new PackageItem(item));

    let customs = pojo.customs || {};
    this.customs = {
      nonDeliveryOption: customs.nonDeliveryOption,
      contents: customs.contents ? customs.contents.map((item) => new CustomsItem(item)) : undefined,
    };

    // Make this object immutable
    hideAndFreeze(this);
    Object.freeze(this.customs.contents);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewPackage);
