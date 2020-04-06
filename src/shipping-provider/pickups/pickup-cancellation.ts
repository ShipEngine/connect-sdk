import { Address, ContactInfo } from "../../address";
import { assert } from "../../assert";
import { PickupCancellationConfig } from "../../config";
import { PickupCancellationReason } from "../../enums";
import { Shipment } from "../../shipment";
import { CustomData, Identifier } from "../../types";
import { ShippingProviderApp } from "../app";
import { PickupService } from "../pickup-service";
import { TimeRange } from "./time-range";

/**
 * Cancellation of a previously-requested package pickup
 */
export class PickupCancellation {
  /**
   * The confirmation ID of the pickup request to be canceled
   */
  public readonly confirmationID: string;

  /**
   * The requested pickup service
   */
  public readonly pickupService: PickupService;

  /**
   * Alternative identifiers associated with this confirmation
   */
  public readonly identifiers: Identifier[];

  /**
   * The reason for the cancellation
   */
  public readonly reason: PickupCancellationReason;

  /**
   * Information about why the customer is cancelling the pickup
   */
  public readonly notes: string;

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
  public readonly timeWindows: TimeRange[];

  /**
   * The shipments to be picked up
   */
  public readonly shipments: Shipment[];

  /**
   * Arbitrary data that was returned when the pickup was originally confirmed.
   */
  public readonly customData?: CustomData;

  /**
   * Creates a PickupRequest from a config object
   */
  public constructor(app: ShippingProviderApp, config: PickupCancellationConfig) {
    assert.type.object(config, "pickup cancellation");
    this.confirmationID = assert.string.nonWhitespace(config.confirmationID);
    this.pickupService = app.getPickupService(config.pickupServiceID);
    this.identifiers = assert.array.ofIdentifiers(config.identifiers, "identifiers", []);
    this.reason = assert.string.enum(config.reason, PickupCancellationReason, "pickup cancellation reason");
    this.notes = assert.string(config.notes, "pickup cancellation notes", "");
    this.address = new Address(config.address);
    this.contact = new ContactInfo(config.contact);
    this.timeWindows = assert.array.nonEmpty(config.timeWindows, "timeWindows")
      .map((window) => new TimeRange(window));
    this.shipments = assert.array.nonEmpty(config.shipments, "shipments")
      .map((shipment) => new Shipment(app, shipment));
    this.customData = assert.type.customData(config.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
    Object.freeze(this.timeWindows);
    Object.freeze(this.shipments);
    Object.freeze(this.customData);
  }
}
