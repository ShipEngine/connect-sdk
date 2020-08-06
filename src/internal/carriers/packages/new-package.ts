import { Customs as CustomsPOJO, DeliveryConfirmationIdentifierPOJO, DimensionsPOJO, MonetaryValuePOJO, NewPackage as INewPackage, PackagingIdentifierPOJO, WeightPOJO } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { Customs } from "../customs/customs";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { NewLabel, NewLabelPOJO } from "../documents/new-label";
import { Packaging } from "../packaging";
import { PackageItem, PackageItemPOJO } from "./package-item";

export interface NewPackagePOJO {
  packaging: PackagingIdentifierPOJO | string;
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO;
  dimensions?: DimensionsPOJO;
  weight?: WeightPOJO;
  insuredValue?: MonetaryValuePOJO;
  containsAlcohol?: boolean;
  isNonMachinable?: boolean;
  label: NewLabelPOJO;
  customs?: CustomsPOJO;
  contents?: readonly PackageItemPOJO[];
}


export class NewPackage implements INewPackage {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      deliveryConfirmation: DefinitionIdentifier[_internal].schema.unknown(true),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
      label: NewLabel[_internal].schema.required(),
      customs: Customs[_internal].schema,
      contents: Joi.array().items(PackageItem[_internal].schema),
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
  public readonly contents: readonly PackageItem[];
  public readonly customs: Customs;

  public constructor(pojo: NewPackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = new MonetaryValue(pojo.insuredValue || { value: 0, currency: "usd" });
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;
    this.label = new NewLabel(pojo.label);
    this.contents = (pojo.contents || []).map((item) => new PackageItem(item));
    this.customs = new Customs(pojo.customs || {});

    // Make this object immutable
    hideAndFreeze(this);
  }
}
