import { DimensionsPOJO, MonetaryValuePOJO, PackageRateCriteria as IPackageRateCriteria, PackagingIdentifierPOJO, WeightPOJO, CustomsPOJO } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, MonetaryValue, Weight, _internal } from "../../common";
import { Packaging } from "../packaging";
import { Customs } from "../customs/customs";
import { setPackaging } from "../utils";

export interface PackageRateCriteriaPOJO {
  packaging?: PackagingIdentifierPOJO | string;
  dimensions?: DimensionsPOJO;
  weight?: WeightPOJO;
  insuredValue?: MonetaryValuePOJO;
  containsAlcohol?: boolean;
  isNonMachinable?: boolean;
  customs?: CustomsPOJO;
}



export class PackageRateCriteria implements IPackageRateCriteria {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.alternatives(DefinitionIdentifier[_internal].schema.unknown(true), Joi.string().allow("")).optional(),
      deliveryConfirmations: Joi.array()
        .items(Joi.alternatives(DefinitionIdentifier[_internal].schema.unknown(true), Joi.string())),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      insuredValue: MonetaryValue[_internal].schema,
      containsAlcohol: Joi.boolean(),
      isNonMachinable: Joi.boolean(),
      customs: Customs[_internal].schema
    }),
  };

  public readonly packaging?: Packaging | string;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;
  public readonly insuredValue?: MonetaryValue;
  public readonly containsAlcohol: boolean;
  public readonly isNonMachinable: boolean;
  public readonly customs?: Customs;


  public constructor(pojo: PackageRateCriteriaPOJO, app: App) {

    this.packaging = setPackaging(app, pojo.packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.isNonMachinable = pojo.isNonMachinable || false;
    this.customs = new Customs(pojo.customs || {});

    // Make this object immutable
    hideAndFreeze(this);
  }
}
