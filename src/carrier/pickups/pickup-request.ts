import { Address, App, ContactInfo, Note, TimeRange } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../internal";
import { PickupRequestPOJO } from "./pickup-request-pojo";
import { PickupService } from "./pickup-service";
import { PickupShipment } from "./pickup-shipment";

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
      notes: Note[_internal].notesSchema,
      shipments: Joi.array().min(1).items(PickupShipment[_internal].schema).required(),
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
  public readonly notes: ReadonlyArray<Note>;

  /**
   * The shipments to be picked up
   */
  public readonly shipments: ReadonlyArray<PickupShipment>;

  //#endregion

  public constructor(pojo: PickupRequestPOJO, app: App) {
    this.pickupService = app[_internal].references.lookup(pojo.pickupServiceID, PickupService);
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.notes = createNotes(pojo.notes);
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupRequest);
