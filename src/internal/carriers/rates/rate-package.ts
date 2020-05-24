import { RatePackage as IRatePackage, RatePackagePOJO } from "../../../public";
import { App, DefinitionIdentifier, hideAndFreeze, Joi, _internal } from "../../common";
import { DeliveryConfirmation } from "../delivery-confirmation";
import { Packaging } from "../packaging";

export class RatePackage implements IRatePackage {
  public static readonly [_internal] = {
    label: "package",
    schema: Joi.object({
      packaging: DefinitionIdentifier[_internal].schema.unknown(true).required(),
      deliveryConfirmation: DefinitionIdentifier[_internal].schema.unknown(true),
    }),
  };

  public readonly packaging: Packaging;
  public readonly deliveryConfirmation?: DeliveryConfirmation;

  public constructor(pojo: RatePackagePOJO, app: App) {
    this.packaging = app[_internal].references.lookup(pojo.packaging, Packaging);
    this.deliveryConfirmation =
      app[_internal].references.lookup(pojo.deliveryConfirmation, DeliveryConfirmation);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
