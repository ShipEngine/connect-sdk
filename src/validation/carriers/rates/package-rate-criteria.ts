import { PackageRateCriteria as IPackageRateCriteria, PackageRateCriteria as PackageRateCriteriaPOJO } from "../../../definitions";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { Packaging } from "../packaging";

export class PackageRateCriteria implements IPackageRateCriteria {
  public static [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.array()
        .items(Joi.alternatives(DefinitionIdentifier[_internal].schema.unknown(true), Joi.string())),
      deliveryConfirmations: Joi.array()
        .items(Joi.alternatives(DefinitionIdentifier[_internal].schema.unknown(true), Joi.string())),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
    }),
  };

  public packaging: Array<Packaging>;
  public deliveryConfirmations: Array<DeliveryConfirmation>;
  public dimensions?: Dimensions;
  public weight?: Weight;
  public insuredValue?: MonetaryValue;
  public containsAlcohol: boolean;
  public isNonMachinable: boolean;

  public constructor(pojo: PackageRateCriteriaPOJO, app: App) {
    this.packaging = (pojo.packaging || [])
      .map((id) => app[_internal].references.lookup(id, Packaging));
    this.deliveryConfirmations = (pojo.deliveryConfirmations || [])
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
