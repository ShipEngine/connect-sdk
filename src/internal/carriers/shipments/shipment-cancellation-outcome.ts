import { CancellationStatus, ShipmentCancellationOutcome as ShipmentCancellationOutcomePOJO, UUID } from "../../../public";
import { hideAndFreeze, Joi, Note, _internal } from "../../common";
import { ShipmentIdentifier } from "./shipment-identifier";

export class ShipmentCancellationOutcome {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      cancellationID: Joi.string().uuid().required(),
      status: Joi.string().enum(CancellationStatus).required(),
      confirmationNumber: Joi.string().singleLine().allow(""),
      code: Joi.string().singleLine().allow(""),
      description: Joi.string().singleLine().allow(""),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly cancellationID: UUID;
  public readonly status: CancellationStatus;
  public readonly confirmationNumber: string;
  public readonly code: string;
  public readonly description: string;
  public readonly notes: readonly Note[];
  public readonly metadata: object;

  public constructor(pojo: ShipmentCancellationOutcomePOJO) {
    this.cancellationID = pojo.cancellationID;
    this.status = pojo.status;
    this.confirmationNumber = pojo.confirmationNumber || "";
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = pojo.notes || [];
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
