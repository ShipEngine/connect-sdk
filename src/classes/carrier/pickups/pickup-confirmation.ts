import { PickupConfirmationPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { CustomData, Identifier } from "../../common";
import { Shipment, ShipmentIdentifier } from "../shipment";
import { TimeRange } from "./time-range";

/**
 * Confirmation that a package pickup has been scheduled
 */
export class PickupConfirmation {
  //#region Class Fields

  public static readonly label = "pickup confirmation";

  /** @internal */
  public static readonly schema = Joi.object({
    cancellationID: Joi.string().trim().singleLine().allow("").max(100),
    identifiers: Joi.array().items(Identifier.schema),
    shipments: Joi.array().min(1).items(Shipment.schema),
    timeWindows: Joi.array().min(1).items(TimeRange.schema).required(),
    notes: Joi.string().allow("").max(5000),
    customData: CustomData.schema,
  });

  //#endregion
  //#region Instance Fields

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

  //#endregion

  public constructor(pojo: PickupConfirmationPOJO) {
    validate(pojo, PickupConfirmation);

    this.confirmationID = pojo.confirmationID;
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.shipments = pojo.shipments ? pojo.shipments.map((shipment) => new ShipmentIdentifier(shipment)) : [];
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.notes = pojo.notes || "";
    this.customData = pojo.customData && new CustomData(pojo.customData);

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
    Object.freeze(this.shipments);
    Object.freeze(this.timeWindows);
  }
}
