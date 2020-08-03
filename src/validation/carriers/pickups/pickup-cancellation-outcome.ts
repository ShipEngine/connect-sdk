import { CancellationStatus, PickupCancellationOutcome as IPickupCancellationOutcome, PickupCancellationOutcome as PickupCancellationOutcomePOJO, UUID } from "../../../definitions";
import { createNotes, hideAndFreeze, Joi, Note, _internal } from "../../common";

export class PickupCancellationOutcome implements IPickupCancellationOutcome {
  public static [_internal] = {
    label: "pickup",
    schema: Joi.object({
      cancellationID: Joi.string().uuid().required(),
      status: Joi.string().enum(CancellationStatus).required(),
      confirmationNumber: Joi.string().trim().singleLine().allow("").max(100),
      code: Joi.string().trim().singleLine().allow("").max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public cancellationID: UUID;
  public status: CancellationStatus;
  public confirmationNumber?: string;
  public code?: string;
  public description?: string;
  public notes?: Array<Note>;
  public metadata?: object;

  public constructor(pojo: PickupCancellationOutcomePOJO) {
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
