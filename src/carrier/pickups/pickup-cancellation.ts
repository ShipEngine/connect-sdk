import { Address, ContactInfo, Identifiers, Note, TimeRange } from "../../common";
import { App, createNotes, hideAndFreeze, Joi, _internal } from "../../internal";
import { UUID } from "../../types";
import { PickupCancellationReason } from "../enums";
import { PickupCancellationPOJO } from "./pickup-cancellation-pojo";
import { PickupService } from "./pickup-service";
import { PickupShipment } from "./pickup-shipment";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export class PickupCancellation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup cancellation",
    schema: Joi.object({
      cancellationID: Joi.string().uuid().required(),
      confirmationID: Joi.string().trim().singleLine().min(1).max(100),
      pickupServiceID: Joi.string().uuid().required(),
      identifiers: Identifiers[_internal].schema,
      reason: Joi.string().enum(PickupCancellationReason).required(),
      notes: Note[_internal].notesSchema,
      address: Address[_internal].schema.required(),
      contact: ContactInfo[_internal].schema.required(),
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      shipments: Joi.array().min(1).items(PickupShipment[_internal].schema).required(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The unique ID of this cancellation. This ID is used to correlate cancellations with outcomes.
   */
  public readonly cancellationID: UUID;

  /**
   * The confirmation ID of the pickup request to be canceled
   */
  public readonly confirmationID: string;

  /**
   * The requested pickup service
   */
  public readonly pickupService: PickupService;

  /**
   * Custom identifiers for this confirmation
   */
  public readonly identifiers: Identifiers;

  /**
   * The reason for the cancellation
   */
  public readonly reason: PickupCancellationReason;

  /**
   * Information about why the customer is cancelling the pickup
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * The address where the pickup was requested
   */
  public readonly address: Address;

  /**
   * The contact information of the person who scheduled/canceled the pickup
   */
  public readonly contact: ContactInfo;

  /**
   * A list of dates and times when the carrier intended to pickup
   */
  public readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The shipments to be picked up
   */
  public readonly shipments: ReadonlyArray<PickupShipment>;

  /**
   * Arbitrary data about this pickup that was previously persisted by the ShipEngine Platform.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: PickupCancellationPOJO, app: App) {
    this.cancellationID = pojo.cancellationID;
    this.confirmationID = pojo.confirmationID || "";
    this.pickupService = app[_internal].references.lookup(pojo.pickupServiceID, PickupService);
    this.identifiers = new Identifiers(pojo.identifiers);
    this.reason = pojo.reason;
    this.notes = createNotes(pojo.notes);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupCancellation);
