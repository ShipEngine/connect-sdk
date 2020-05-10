import { PickupCancellationReason } from "../../../enums";
import { hideAndFreeze, Joi, validate, _internal } from "../../../internal";
import { PickupCancellationPOJO } from "../../../pojos/carrier";
import { Address, ContactInfo, CustomData, Identifier, TimeRange } from "../../common";
import { App } from "../../common/app";
import { PickupService } from "../pickup-service";
import { Shipment } from "../shipments/shipment";

/**
 * Cancellation of a previously-scheduled package pickup
 */
export class PickupCancellation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup cancellation",
    schema: Joi.object({
      confirmationID: Joi.string().trim().singleLine().min(1).max(100).required(),
      pickupServiceID: Joi.string().uuid().required(),
      identifiers: Joi.array().items(Identifier[_internal].schema),
      reason: Joi.string().enum(PickupCancellationReason).required(),
      notes: Joi.string().allow("").max(5000),
      address: Address[_internal].schema.required(),
      contact: ContactInfo[_internal].schema.required(),
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      shipments: Joi.array().min(1).items(Shipment[_internal].schema).required(),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

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
  public readonly customData: CustomData;

  //#endregion

  public constructor(pojo: PickupCancellationPOJO, app: App) {
    validate(pojo, PickupCancellation);

    this.confirmationID = pojo.confirmationID;
    this.pickupService = app[_internal].references.lookup(pojo.pickupServiceID, PickupService);
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.reason = pojo.reason;
    this.notes = pojo.notes || "";
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.shipments = pojo.shipments.map((shipment) => new Shipment(shipment, app));
    this.customData = new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupCancellation);
