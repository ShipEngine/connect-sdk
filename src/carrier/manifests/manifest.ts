import { Identifiers, Note } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../internal";
import { Document } from "../documents/document";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { ManifestPOJO } from "./manifest-pojo";


/**
 * An end-of-day manifest
 */
export class Manifest {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "manifest",
    schema: Joi.object({
      manifestID: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
      shipments: Joi.array().min(1).items(
        ShipmentIdentifier[_internal].schema.unknown(true)).required(),
      document: Document[_internal].schema,
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's manifest ID, if any
   */
  public readonly manifestID: string;

  /**
   * Custom identifiers for this manifest
   */
  public readonly identifiers: Identifiers;

  /**
   * The shipments that are included on this manifest.
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * The digital manifst document, such as a PDF SCAN form
   */
  public readonly document?: Document;

  /**
   * Human-readable information about the manifest
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this manifest that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ManifestPOJO) {
    this.manifestID = pojo.manifestID || "";
    this.identifiers = new Identifiers(pojo.identifiers);
    this.shipments = pojo.shipments.map((shipment) => new ShipmentIdentifier(shipment));
    this.document = pojo.document && new Document({
      ...pojo.document,
      name: pojo.document.name || "SCAN Form",
    });
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Manifest);
