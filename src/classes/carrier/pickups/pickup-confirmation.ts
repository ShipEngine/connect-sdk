import { assert } from "../../../assert";
import { PickupConfirmationPOJO } from "../../../pojos";
import { CustomData, Identifier } from "../../../types";
import { ShipmentIdentifier } from "../../shipment";
import { TimeRange } from "./time-range";

/**
 * Confirmation that a package pickup has been scheduled
 */
export class PickupConfirmation {
  /**
   * The carrier's confirmation ID
   */
  public readonly confirmationID: string;

  /**
   * Alternative identifiers associated with this confirmation
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  /**
   * The shipments to be picked-up
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  public readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * Additional information about the pickup confirmation
   */
  public readonly notes: string;

  /**
   * Arbitrary data for that will be persisted by ShipEngine IPaaS.
   * If the pickup is later canceled, this data will be included.
   */
  public readonly customData?: CustomData;

  public constructor(pojo: PickupConfirmationPOJO) {
    assert.type.object(pojo, "pickup confirmation");
    this.confirmationID = assert.string.nonWhitespace(pojo.confirmationID, "pickup confirmation ID");
    this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "identifiers", []);
    this.shipments = assert.array.nonEmpty(pojo.shipments, "shipments")
      .map((shipment) => new ShipmentIdentifier(shipment));
    this.timeWindows = assert.array.nonEmpty(pojo.timeWindows, "time windows")
      .map((time) => new TimeRange(time));
    this.notes = assert.string(pojo.notes, "pickup confirmation notes", "");
    this.customData = assert.type.customData(pojo.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
    Object.freeze(this.shipments);
    Object.freeze(this.timeWindows);
    Object.freeze(this.customData);
  }
}
