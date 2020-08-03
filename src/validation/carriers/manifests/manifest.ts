import { Manifest as IManifest, Manifest as ManifestPOJO } from "../../../definitions";
import { createNotes, hideAndFreeze, Identifiers, Joi, Note, _internal } from "../../common";
import { Document } from "../documents/document";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class Manifest implements IManifest {
  public static [_internal] = {
    label: "manifest",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
      shipments: Joi.array().min(1).items(
        ShipmentIdentifier[_internal].schema.unknown(true)).required(),
      document: Document[_internal].schema,
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public id: string;
  public identifiers: Identifiers;
  public shipments: Array<ShipmentIdentifier>;
  public document?: Document;
  public notes: Array<Note>;
  public metadata: object;

  public constructor(pojo: ManifestPOJO) {
    this.id = pojo.id || "";
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
