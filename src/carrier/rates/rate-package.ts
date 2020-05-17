import { App, hideAndFreeze, Joi, _internal } from "../../internal";
import { UUID } from "../../types";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { Packaging } from "../packaging";

/**
 * The package information for a rate
 */
export interface RatePackagePOJO {
  /**
   * The ID of the packaging this rate is for
   */
  packagingID: UUID;

  /**
   * The ID of the delivery confirmation included in this rate
   */
  deliveryConfirmationID?: UUID;
}


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
      deliveryConfirmationID: Joi.string().uuid(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The packaging this rate is for
   */
  public readonly packaging: Packaging;

  /**
   * The delivery confirmation included in this rate
   */
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  //#endregion

  public constructor(pojo: RatePackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packagingID, Packaging);
    this.deliveryConfirmation = app[_internal].references.lookup(pojo.deliveryConfirmationID, DeliveryConfirmation);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RatePackage);
