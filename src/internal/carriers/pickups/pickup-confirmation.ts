import { PickupConfirmation as PickupConfirmationPOJO } from "../../../public";
import { calculateTotalCharges, Charge, hideAndFreeze, Identifiers, Joi, MonetaryValue, Note, TimeRange, _internal } from "../../common";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class PickupConfirmation {
  public static readonly [_internal] = {
    label: "pickup",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).required(),
      identifiers: Identifiers[_internal].schema,
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      shipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema.unknown(true)),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly id: string;
  public readonly identifiers: Identifiers;
  public readonly timeWindows: readonly TimeRange[];
  public readonly charges: readonly Charge[];
  public readonly totalAmount: MonetaryValue;
  public readonly shipments: readonly ShipmentIdentifier[];
  public readonly notes: readonly Note[];
  public readonly metadata: object;

  public constructor(pojo: PickupConfirmationPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.shipments = pojo.shipments!.map((shipment) => new ShipmentIdentifier(shipment));
    this.notes = pojo.notes || [];
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
