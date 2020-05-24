import { ManifestConfirmation as IManifestConfirmation, ManifestConfirmationPOJO } from "../../../public";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { Manifest } from "./manifest";
import { NonManifestedShipment } from "./non-manifested-shipment";

export class ManifestConfirmation implements IManifestConfirmation {
  public static readonly [_internal] = {
    label: "manifest confirmation",
    schema: Joi.object({
      manifetsts: Joi.array().min(1).items(Manifest[_internal].schema).required(),
      notManifested: Joi.array().items(NonManifestedShipment[_internal].schema),
    }),
  };

  public readonly manifests: ReadonlyArray<Manifest>;
  public readonly notManifested: ReadonlyArray<NonManifestedShipment>;

  public constructor(pojo: ManifestConfirmationPOJO) {
    this.manifests = pojo.manifests.map((manifest) => new Manifest(manifest));
    this.notManifested = pojo.notManifested
      ? pojo.notManifested.map((shipment) => new NonManifestedShipment(shipment)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
