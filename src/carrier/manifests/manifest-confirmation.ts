import { Identifier } from "../../common";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { Document } from "../document";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { ManifestConfirmationPOJO } from "./manifest-confirmation-pojo";


/**
 * The information needed to create an end-of-day manifest
 */
export class ManifestConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "manifest",
    schema: Joi.object({
      manifestNumber: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Joi.array().items(Identifier[_internal].schema),
      shipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema.unknown(true)).required(),
      document: Document[_internal].schema,
      notes: Joi.string().allow("").max(5000),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's manifest number, if any
   */
  public readonly manifestNumber: string;

  /**
   * Alternative identifiers associated with this manifest
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  /**
   * The shipments that are included on this manifest.
   * If not specified, the assumption is that the manifest includes all of the shipments.
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * The digital manifst document, such as a PDF SCAN form
   */
  public readonly document?: Document;

  /**
   * Human-readable information about the manifest
   */
  public readonly notes: string;

  /**
   * Arbitrary data about this manifest that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata?: object;

  //#endregion

  public constructor(pojo: ManifestConfirmationPOJO) {
    this.manifestNumber = pojo.manifestNumber || "";
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.shipments = pojo.shipments!.map((shipment) => new ShipmentIdentifier(shipment));
    this.document = pojo.document && new Document({
      ...pojo.document,
      name: pojo.document.name || "SCAN Form",
    });
    this.notes = pojo.notes || "";
    this.metadata = pojo.metadata;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ManifestConfirmation);
