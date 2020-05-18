import { CancellationStatus, Note, UUID } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { PickupCancellationOutcomePOJO } from "./pickup-cancellation-outcome-pojo";

/**
 * The outcome of a pickup cancellation
 */
export class PickupCancellationOutcome {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
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

  //#endregion
  //#region Public Fields

  /**
   * Indicates which pickup cancellation this outcome is for.
   */
  public readonly cancellationID: UUID;

  /**
   * The status of the cancellation
   */
  public readonly status: CancellationStatus;

  /**
   * The confirmation number of the cancellation
   */
  public readonly confirmationNumber: string;

  /**
   * The carrier's code for this cancellation outcome
   */
  public readonly code: string;

  /**
   * The carrier's description of the cancellation outcome.
   * This description should not be specific to this particular pickup.
   */
  public readonly description: string;

  /**
   * Additional information/instructions regarding the cancellation
   * (e.g. "Please call ###-#### to cancel", "Cannot cancel because driver is en-route")
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

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

// Prevent modifications to the class
hideAndFreeze(PickupCancellationOutcome);
