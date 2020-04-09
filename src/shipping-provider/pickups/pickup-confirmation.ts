import { assert } from "../../assert";
import { PickupConfirmationConfig } from "../../config";
import { ShipmentIdentifier } from "../../shipment";
import { CustomData, Identifier } from "../../types";
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

  /**
   * Creates a PickupConfirmation from a config object
   */
  public constructor(config: PickupConfirmationConfig) {
    assert.type.object(config, "pickup confirmation");
    this.confirmationID = assert.string.nonWhitespace(config.confirmationID, "pickup confirmation ID");
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "identifiers", []);
    this.shipments = assert.array.nonEmpty(config.shipments, "shipments")
      .map((shipment) => new ShipmentIdentifier(shipment));
    this.timeWindows = assert.array.nonEmpty(config.timeWindows, "time windows")
      .map((time) => new TimeRange(time));
    this.notes = assert.string(config.notes, "pickup confirmation notes", "");
    this.customData = assert.type.customData(config.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
    Object.freeze(this.shipments);
    Object.freeze(this.timeWindows);
    Object.freeze(this.customData);
  }
}
