import { PickupConfirmationPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { CustomData, Identifier, MonetaryValue, TimeRange } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";
import { ShippingCharge } from "../shipping-charge";
import { calculateTotalCharges } from "../utils";

/**
 * Confirmation that a package pickup has been scheduled
 */
export class PickupConfirmation {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "pickup confirmation",
    schema: Joi.object({
      confirmationID: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Joi.array().items(Identifier[_internal].schema),
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      charges: Joi.array().min(1).items(ShippingCharge[_internal].schema).required(),
      shipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema.unknown(true)),
      notes: Joi.string().allow("").max(5000),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's confirmation ID
   */
  public readonly confirmationID: string;

  /**
   * Alternative identifiers associated with this pickup
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  /**
   * A list of dates and times when the carrier intends to be available to pickup
   */
  public readonly timeWindows: ReadonlyArray<TimeRange>;

  /**
   * The breakdown of charges for this pickup.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "pickup".
   */
  public readonly charges: ReadonlyArray<ShippingCharge>;

  /**
   * The total cost of all charges for this pickup.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * The shipments to be picked-up.
   */
  public readonly shipments: ReadonlyArray<ShipmentIdentifier>;

  /**
   * Additional information about the pickup confirmation
   */
  public readonly notes: string;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   * If the pickup is later canceled, this data will be included.
   */
  public readonly customData?: CustomData;

  //#endregion

  public constructor(pojo: PickupConfirmationPOJO) {
    validate(pojo, PickupConfirmation);

    this.confirmationID = pojo.confirmationID;
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.charges = pojo.charges.map((charge) => new ShippingCharge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.shipments = pojo.shipments ? pojo.shipments.map((shipment) => new ShipmentIdentifier(shipment)) : [];
    this.notes = pojo.notes || "";
    this.customData = pojo.customData && new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(PickupConfirmation);
