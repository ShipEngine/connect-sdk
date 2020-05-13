import { DateTimeZone, PartialAddress, PersonName } from "../../common";
import { ShipmentStatus } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";
import { TrackingEventPOJO } from "./tracking-event-pojo";

/**
 * An event or status change that occurred while processing a shipment
 */
export class TrackingEvent {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "tracking event",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100),
      dateTime: DateTimeZone[_internal].schema.required(),
      status: Joi.string().enum(ShipmentStatus).required(),
      code: Joi.string().trim().singleLine().min(1).max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      isError: Joi.boolean(),
      errorCode: Joi.string().trim().singleLine().min(1).max(100),
      errorDescription: Joi.string().trim().singleLine().allow("").max(1000),
      address: PartialAddress[_internal].schema,
      signer: Joi.alternatives(
        Joi.string().trim().singleLine().min(1).max(100),
        PersonName[_internal].schema
      ),
      notes: Joi.string().allow("").max(5000),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The user-friendly name of the event (e.g. "Arrived at Warehouse", "Delivered")
   */
  public readonly name: string;

  /**
   * The date/time that this event occurred
   */
  public readonly dateTime: DateTimeZone;

  /**
   * The shipment status at the time of this event
   */
  public readonly status: ShipmentStatus;

  /**
   * The carrier's event or status code
   */
  public readonly code: string;

  /**
   * The carrier's description of the event or status code.
   * This description should not be specific to this particular shipment
   */
  public readonly description: string;

  /**
   * Indicates whether this event represents an error state, such as a lost package or failed delivery.
   */
  public readonly isError: boolean;

  /**
   * The carrier's error code
   */
  public readonly errorCode: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  public readonly errorDescription: string;

  /**
   * The address (or as much of it as is known) where the event occurred
   */
  public readonly address?: PartialAddress;

  /**
   * The name of the person who signed or approved this event.
   * This is usually only relevant for the "Deliverd" event.
   */
  public readonly signer?: PersonName;

  /**
   * Human-readable information regarding this event, such as details about the error state
   * or a description of where the package was placed upon delivery.
   */
  public readonly notes: string;

  //#endregion

  public constructor(pojo: TrackingEventPOJO) {
    this.name = pojo.name || "";
    this.dateTime = new DateTimeZone(pojo.dateTime);
    this.status = pojo.status;
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.isError = pojo.isError || false;
    this.errorCode = pojo.errorCode || "";
    this.errorDescription = pojo.errorDescription || "";
    this.address = pojo.address && new PartialAddress(pojo.address);
    this.signer = pojo.signer ? new PersonName(pojo.signer) : undefined;
    this.notes = pojo.notes || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingEvent);
