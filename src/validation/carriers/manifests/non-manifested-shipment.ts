import { NonManifestedShipment as INonManifestedShipment, NonManifestedShipmentPOJO } from "../../../definitions";
import { createNotes, hideAndFreeze, Joi, Note, _internal } from "../../common";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class NonManifestedShipment implements INonManifestedShipment {
  public static readonly [_internal] = {
    label: "manifest confirmation",
    schema: ShipmentIdentifier[_internal].schema.keys({
      code: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Note[_internal].notesSchema,
    }),
  };

  public readonly code: string;
  public readonly description: string;
  public readonly notes: ReadonlyArray<Note>;

  public constructor(pojo: NonManifestedShipmentPOJO) {
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = createNotes(pojo.notes);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
