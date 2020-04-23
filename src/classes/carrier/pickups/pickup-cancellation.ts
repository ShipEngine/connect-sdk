import { assert } from "../../../assert";
import { PickupCancellationReason } from "../../../enums";
import { PickupCancellationPOJO } from "../../../pojos";
import { CustomData, Identifier } from "../../../types";
import { Address } from "../../address";
import { App } from "../../app";
import { ContactInfo } from "../../contact-info";
import { Shipment } from "../../shipment";
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
  public readonly identifiers: ReadonlyArray<Identifier>;

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
  public readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The shipments to be picked up
   */
  public readonly shipments: ReadonlyArray<Shipment>;

  /**
   * Arbitrary data that was returned when the pickup was originally confirmed.
   */
  public readonly customData?: CustomData;

  public constructor(app: App, pojo: PickupCancellationPOJO) {
    assert.type.object(pojo, "pickup cancellation");
    this.confirmationID = assert.string.nonWhitespace(pojo.confirmationID);
    this.pickupService = app._references.lookup(pojo.pickupServiceID, PickupService, "pickup service");
    this.identifiers = assert.array.ofIdentifiers(pojo.identifiers, "identifiers", []);
    this.reason = assert.string.enum(pojo.reason, PickupCancellationReason, "pickup cancellation reason");
    this.notes = assert.string(pojo.notes, "pickup cancellation notes", "");
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.timeWindows = assert.array.nonEmpty(pojo.timeWindows, "timeWindows")
      .map((window) => new TimeRange(window));
    this.shipments = assert.array.nonEmpty(pojo.shipments, "shipments")
      .map((shipment) => new Shipment(app, shipment));
    this.customData = assert.type.customData(pojo.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
    Object.freeze(this.timeWindows);
    Object.freeze(this.shipments);
    Object.freeze(this.customData);
  }
}
