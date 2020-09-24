import { PackageTrackingInfo as PackageTrackingInfoPOJO } from "../../../public";
import { App, DefinitionIdentifier, Dimensions, hideAndFreeze, Joi, Weight, _internal } from "../../common";
import { Packaging } from "../packaging";

export class PackageTrackingInfo {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
    }),
  };

  public readonly packaging?: Packaging | string;
  public readonly dimensions?: Dimensions;
  public readonly weight?: Weight;

  public constructor(pojo: PackageTrackingInfoPOJO, app: App) {
    let pkg;

    try {
      pkg = app[_internal].references.lookup(pojo.packaging, Packaging);
    } catch {
      if (typeof pojo.packaging === 'string') {
        pkg = pojo.packaging;
      }
    }

    this.packaging = pkg;
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
