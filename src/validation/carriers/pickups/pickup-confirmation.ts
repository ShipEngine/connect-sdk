import { PickupConfirmation as IPickupConfirmation, PickupConfirmation as PickupConfirmationPOJO } from "../../../definitions";
import { calculateTotalCharges, Charge, createNotes, hideAndFreeze, Identifiers, Joi, MonetaryValue, Note, TimeRange, _internal } from "../../common";
import { ShipmentIdentifier } from "../shipments/shipment-identifier";

export class PickupConfirmation implements IPickupConfirmation {
  public static [_internal] = {
    label: "pickup",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      shipments: Joi.array().min(1).items(ShipmentIdentifier[_internal].schema.unknown(true)),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public id: string;
  public identifiers: Identifiers;
  public timeWindows: Array<TimeRange>;
  public charges: Array<Charge>;
  public totalAmount: MonetaryValue;
  public shipments: Array<ShipmentIdentifier>;
  public notes: Array<Note>;
  public metadata: object;

  public constructor(pojo: PickupConfirmationPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.shipments = pojo.shipments!.map((shipment) => new ShipmentIdentifier(shipment));
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
