import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { Manifest } from "./manifest";
import { ManifestPOJO } from "./manifest-pojo";
import { NonManifestedShipment, NonManifestedShipmentPOJO } from "./non-manifested-shipment";

/**
 * Confirmation that an end-of-day manifest has been created
 */
export interface ManifestConfirmationPOJO {
  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  manifests: ReadonlyArray<ManifestPOJO>;

  /**
   * An array of the shipments that could not be manifested, and why
   */
  notManifested?: ReadonlyArray<NonManifestedShipmentPOJO>;
}


/**
 * Confirmation that an end-of-day manifest has been created
 */
export class ManifestConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "manifest confirmation",
    schema: Joi.object({
      manifetsts: Joi.array().min(1).items(Manifest[_internal].schema).required(),
      notManifested: Joi.array().items(NonManifestedShipment[_internal].schema),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  public readonly manifests: ReadonlyArray<Manifest>;

  /**
   * An array of the shipments that could not be manifested, and why
   */
  public readonly notManifested: ReadonlyArray<NonManifestedShipment>;

  //#endregion

  public constructor(pojo: ManifestConfirmationPOJO) {
    this.manifests = pojo.manifests.map((manifest) => new Manifest(manifest));
    this.notManifested = pojo.notManifested
      ? pojo.notManifested.map((shipment) => new NonManifestedShipment(shipment)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ManifestConfirmation);
