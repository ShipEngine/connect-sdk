import { CancellationStatus, Note } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../internal";
import { UUID } from "../../types";
import { ShipmentCancellationOutcomePOJO } from "./shipment-cancellation-outcome-pojo";
import { ShipmentIdentifier } from "./shipment-identifier";

/**
 * The outcome of a shipment cancellation
 */
export class ShipmentCancellationOutcome {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      cancellationID: Joi.string().uuid().required(),
      status: Joi.string().enum(CancellationStatus).required(),
      confirmationID: Joi.string().trim().singleLine().allow("").max(100),
      code: Joi.string().trim().singleLine().min(1).max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates which cancellation request this confirmation is for.
   */
  public readonly cancellationID: UUID;

  /**
   * The status of the cancellation
   */
  public readonly status: CancellationStatus;

  /**
   * The confirmation ID of the cancellation
   */
  public readonly confirmationID: string;

  /**
   * The carrier's code for this cancellation outcome
   */
  public readonly code: string;

  /**
   * The carrier's description of the cancellation outcome.
   * This description should not be specific to this particular shipment.
   */
  public readonly description: string;

  /**
   * Human-readable information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this shipment that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentCancellationOutcomePOJO) {
    this.cancellationID = pojo.cancellationID;
    this.status = pojo.status;
    this.confirmationID = pojo.confirmationID || "";
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentCancellationOutcome);
