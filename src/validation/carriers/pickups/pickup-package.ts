import { PickupPackage as IPickupPackage, PickupPackage as PickupPackagePOJO } from "../../../definitions";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, Weight, _internal } from "../../common";
import { PackageIdentifier, PackageIdentifierBase } from "../packages/package-identifier";
import { Packaging } from "../packaging";

export class PickupPackage extends PackageIdentifierBase implements IPickupPackage {
  public static [_internal] = {
    label: "package",
    schema: PackageIdentifier[_internal].schema.keys({
      packaging: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
      metadata: Joi.object(),
    }),
  };

  public packaging: Packaging;
  public dimensions?: Dimensions;
  public weight?: Weight;
  public metadata: object;

  public constructor(pojo: PickupPackagePOJO, app: App) {
    super(pojo);

    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
