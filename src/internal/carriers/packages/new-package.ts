import { Currency, NewPackage as INewPackage, NewPackagePOJO, NonDeliveryOption } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { NewLabel } from "../documents/new-label";
import { Packaging } from "../packaging";
import { CustomsItem } from "./customs-item";
import { PackageItem } from "./package-item";

export class NewPackage implements INewPackage {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: DefinitionIdentifier[_internal].schema.unknown(true).required(),
      deliveryConfirmation: DefinitionIdentifier[_internal].schema.unknown(true),
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

  public readonly packaging: Packaging;
  public readonly deliveryConfirmation?: DeliveryConfirmation;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;
  public readonly insuredValue: MonetaryValue;
  public readonly containsAlcohol: boolean;
  public readonly isNonMachinable: boolean;
  public readonly label: NewLabel;
  public readonly contents: ReadonlyArray<PackageItem>;

  public readonly customs: {
    nonDeliveryOption?: NonDeliveryOption;
    contents: ReadonlyArray<CustomsItem>;
  };

  public constructor(pojo: NewPackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);
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
      contents: customs.contents ? customs.contents.map((item) => new CustomsItem(item)) : [],
    };

    // Make this object immutable
    hideAndFreeze(this);
    Object.freeze(this.customs.contents);
  }
}
