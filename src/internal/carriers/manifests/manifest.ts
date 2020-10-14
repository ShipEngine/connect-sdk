import { Manifest as ManifestPOJO } from "../../../public";
import { hideAndFreeze, Identifiers, Joi, Note, _internal } from "../../common";
import { Document } from "../documents/document";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class Manifest {
  public static readonly [_internal] = {
    label: "manifest",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().allow(""),
      identifiers: Identifiers[_internal].schema,
      shipments: Joi.array().min(1).items(
        ShipmentIdentifier[_internal].schema.unknown(true)).required(),
      document: Document[_internal].schema,
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly id: string;
  public readonly identifiers: Identifiers;
  public readonly shipments: readonly ShipmentIdentifier[];
  public readonly document?: Document;
  public readonly notes: readonly Note[];
  public readonly metadata: object;

  public constructor(pojo: ManifestPOJO) {
    this.id = pojo.id || "";
    this.identifiers = new Identifiers(pojo.identifiers);
    this.shipments = pojo.shipments.map((shipment) => new ShipmentIdentifier(shipment));
    this.document = pojo.document && new Document({
      ...pojo.document,
      name: pojo.document.name || "SCAN Form",
    });
    this.notes = pojo.notes || [];
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
