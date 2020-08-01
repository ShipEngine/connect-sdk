import { PickupPackage as IPickupPackage, PickupPackagePOJO } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, Weight, _internal } from "../../common";
import { PackageIdentifier, PackageIdentifierBase } from "../packages/package-identifier";
import { Packaging } from "../packaging";

export class PickupPackage extends PackageIdentifierBase implements IPickupPackage {
  public static readonly [_internal] = {
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

  public readonly packaging: Packaging;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;
  public readonly metadata: object;

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
