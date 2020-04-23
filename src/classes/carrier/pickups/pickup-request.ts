import { assert } from "../../../assert";
import { PickupRequestPOJO } from "../../../pojos";
import { Address } from "../../address";
import { App } from "../../app";
import { ContactInfo } from "../../contact-info";
import { Shipment } from "../../shipment";
import { PickupService } from "../pickup-service";
import { TimeRange } from "./time-range";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export class PickupRequest {
  /**
   * The requested pickup service
   */
  public readonly pickupService: PickupService;

  /**
   * The requested window of time for the carrier to arrive.
   */
  public readonly timeWindow: TimeRange;

  /**
   * The address where the packages should be picked up
   */
  public readonly address: Address;

  /**
   * Additional information about the pickup
   */
  public readonly notes: string;

  /**
   * Contact information about the person there to meet the driver
   */
  public readonly contact: ContactInfo;

  /**
   * The shipments to be picked up
   */
  public readonly shipments: ReadonlyArray<Shipment>;

  public constructor(app: App, pojo: PickupRequestPOJO) {
    assert.type.object(pojo, "pickup request");
    this.pickupService = app._references.lookup(pojo.pickupServiceID, PickupService, "pickup service");
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.notes = assert.string(pojo.notes, "pickup request notes", "");
    this.contact = new ContactInfo(pojo.contact);
    this.shipments = assert.array.nonEmpty(pojo.shipments, "shipments")
      .map((shipment) => new Shipment(app, shipment));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.shipments);
  }
}
