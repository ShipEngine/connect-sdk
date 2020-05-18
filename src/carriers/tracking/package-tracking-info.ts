import { Dimensions, DimensionsPOJO, Weight, WeightPOJO } from "../../common";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { Packaging } from "../packaging";
import { PackagingIdentifierPOJO } from "../packaging-pojo";

/**
 * The actual package info, as determined by the carrier
 */
export interface PackageTrackingInfoPOJO {
  /**
   * The actual packaging that was used, as determined by the carrier
   */
  packaging?: PackagingIdentifierPOJO;

  /**
   * The actual package dimensions as measured by the carrier
   */
  dimensions?: DimensionsPOJO;

  /**
   * The actual package weight as measured by the carrier
   */
  weight?: WeightPOJO;
}


/**
 * The actual package info, as determined by the carrier
 */
export class PackageTrackingInfo {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: DefinitionIdentifier[_internal].schema.unknown(true),
      dimensions: Dimensions[_internal].schema,
      weight: Weight[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The ID of the actual packaging that was used, as determined by the carrier
   */
  public readonly packaging?: Packaging;

  /**
   * The actual package dimensions as measured by the carrier
   */
  public readonly dimensions?: Dimensions;

  /**
   * The actual package weight as measured by the carrier
   */
  public readonly weight?: Weight;

  //#endregion

  public constructor(pojo: PackageTrackingInfoPOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageTrackingInfo);
