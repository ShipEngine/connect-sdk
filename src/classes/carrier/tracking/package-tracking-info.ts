import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { PackageTrackingInfoPOJO } from "../../../pojos/carrier";
import { Dimensions, Weight } from "../../common";
import { App } from "../../common/app";
import { Packaging } from "../packaging";


/**
 * The actual package info, as determined by the carrier
 */
export class PackageTrackingInfo {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packagingID: Joi.string().uuid(),
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
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
    this.dimensions = pojo.dimensions && new Dimensions(pojo.dimensions);
    this.weight = pojo.weight && new Weight(pojo.weight);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PackageTrackingInfo);
