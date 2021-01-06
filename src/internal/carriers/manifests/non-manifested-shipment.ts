import { NonManifestedShipment as NonManifestedShipmentPOJO } from "../../../public";
import { hideAndFreeze, Joi, Note, _internal } from "../../common";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class NonManifestedShipment {
  public static readonly [_internal] = {
    label: "manifest confirmation",
    schema: ShipmentIdentifier[_internal].schema.keys({
      code: Joi.string().singleLine().allow(""),
      description: Joi.string().singleLine().allow(""),
      notes: Note[_internal].notesSchema,
    }),
  };

  public readonly code: string;
  public readonly description: string;
  public readonly notes: readonly Note[];

  public constructor(pojo: NonManifestedShipmentPOJO) {
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = pojo.notes || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
