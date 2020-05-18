import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation-pojo";
import { Packaging } from "../packaging";
import { PackagingIdentifierPOJO } from "../packaging-pojo";

/**
 * The package information for a rate
 */
export interface RatePackagePOJO {
  /**
   * The packaging this rate is for
   */
  packaging: PackagingIdentifierPOJO;

  /**
   * The delivery confirmation included in this rate
   */
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO;
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
      packaging: DefinitionIdentifier[_internal].schema.required(),
      deliveryConfirmation: DefinitionIdentifier[_internal].schema,
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
    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.deliveryConfirmation =
      app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(RatePackage);
