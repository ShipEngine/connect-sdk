import { PickupRequestPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { Address, ContactInfo } from "../../common";
import { App } from "../../common/app";
import { PickupService } from "../pickup-service";
import { Shipment } from "../shipment";
import { TimeRange } from "./time-range";

/**
 * A request for a carrier to pickup package(s) at a time and place
 */
export class PickupRequest {
  //#region Class Fields

  public static readonly label = "pickup request";

  /** @internal */
  public static readonly schema = Joi.object({
    pickupServiceID: Joi.string().uuid().required(),
    timeWindow: TimeRange.schema.required(),
    address: Address.schema.required(),
    contact: ContactInfo.schema.required(),
    notes: Joi.string().allow("").max(5000),
    shipments: Joi.array().min(1).items(Shipment.schema).required(),
  });

  //#endregion
  //#region Instance Fields

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

    this.pickupService = app._references.lookup(pojo.pickupServiceID, PickupService);
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.notes = pojo.notes || "";
    this.shipments = pojo.shipments.map((shipment) => new Shipment(shipment, app));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.shipments);
  }
}
