import { PickupRequestPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { Address, ContactInfo } from "../../common";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { PickupService } from "../pickup-service";
import { Shipment } from "../shipments/shipment";
import { TimeRange } from "./time-range";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export class PickupRequest {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup request",
    schema: Joi.object({
      pickupServiceID: Joi.string().uuid().required(),
      timeWindow: TimeRange[_internal].schema.required(),
      address: Address[_internal].schema.required(),
      contact: ContactInfo[_internal].schema.required(),
      notes: Joi.string().allow("").max(5000),
      shipments: Joi.array().min(1).items(Shipment[_internal].schema).required(),
    }),
  };

  //#endregion
  //#region Public Fields

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
   * Contact information about the person there to meet the driver
   */
  public readonly contact: ContactInfo;

  /**
   * Additional information about the pickup
   */
  public readonly notes: string;

  /**
   * The shipments to be picked up
   */
  public readonly shipments: ReadonlyArray<Shipment>;

  //#endregion

  public constructor(pojo: PickupRequestPOJO, app: App) {
    validate(pojo, PickupRequest);

    this.pickupService = app[_internal].references.lookup(pojo.pickupServiceID, PickupService);
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.notes = pojo.notes || "";
    this.shipments = pojo.shipments.map((shipment) => new Shipment(shipment, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupRequest);
