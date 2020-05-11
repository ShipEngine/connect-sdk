import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { RatePackagePOJO } from "../../../pojos/carrier";
import { App } from "../../common/app";
import { Packaging } from "../packaging";

/**
 * The package information for a rate
 */
export class RatePackage {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label",
    schema: Joi.object({
      packagingID: Joi.string().uuid().required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The packaging this rate is for
   */
  public readonly packaging: Packaging;

  //#endregion

  public constructor(pojo: RatePackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RatePackage);
