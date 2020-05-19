import { Charge, Identifiers, MonetaryValue, Note, TimeRange } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { calculateTotalCharges } from "../utils";
import { PickupConfirmationPOJO } from "./pickup-confirmation-pojo";

/**
 * Confirmation that a package pickup has been scheduled
 */
export class PickupConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      shipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema.unknown(true)),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The unique ID of the pickup
   */
  public readonly id: string;

  /**
   * Your own identifiers for this pickup
   */
  public readonly identifiers: Identifiers;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  public readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  public readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this pickup.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * The shipments to be picked-up.
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * Additional information about the pickup confirmation
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this pickup that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: PickupConfirmationPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.shipments = pojo.shipments!.map((shipment) => new ShipmentIdentifier(shipment));
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupConfirmation);
