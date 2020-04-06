import { Address, ContactInfo } from "../../address";
import { assert } from "../../assert";
import { PickupRequestConfig, ShipmentConfig } from "../../config";
import { Shipment } from "../../shipment";
import { ShippingProviderApp } from "../app";
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
  public readonly shipments: Shipment[];

  /**
   * Creates a PickupRequest from a config object
   */
  public constructor(app: ShippingProviderApp, config: PickupRequestConfig) {
    assert.type.object(config, "pickup request");
    this.pickupService = app.getPickupService(config.pickupServiceID);
    this.timeWindow = new TimeRange(config.timeWindow);
    this.address = new Address(config.address);
    this.notes = assert.string(config.notes, "pickup request notes", "");
    this.contact = new ContactInfo(config.contact);
    this.shipments = assert.array.nonEmpty(config.shipments, "shipments")
      .map((shipment: ShipmentConfig) => new Shipment(app, shipment));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.shipments);
  }
}
