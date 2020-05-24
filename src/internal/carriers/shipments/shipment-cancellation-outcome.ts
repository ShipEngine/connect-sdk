import { CancellationStatus, ShipmentCancellationOutcome as IShipmentCancellationOutcome, ShipmentCancellationOutcomePOJO, UUID } from "../../../public";
import { createNotes, hideAndFreeze, Joi, Note, _internal } from "../../common";
import { ShipmentIdentifier } from "./shipment-identifier";

export class ShipmentCancellationOutcome implements IShipmentCancellationOutcome {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      cancellationID: Joi.string().uuid().required(),
      status: Joi.string().enum(CancellationStatus).required(),
      confirmationNumber: Joi.string().trim().singleLine().allow("").max(100),
      code: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly cancellationID: UUID;
  public readonly status: CancellationStatus;
  public readonly confirmationNumber: string;
  public readonly code: string;
  public readonly description: string;
  public readonly notes: ReadonlyArray<Note>;
  public readonly metadata: object;

  public constructor(pojo: ShipmentCancellationOutcomePOJO) {
    this.cancellationID = pojo.cancellationID;
    this.status = pojo.status;
    this.confirmationNumber = pojo.confirmationNumber || "";
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
