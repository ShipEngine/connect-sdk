import { PickupCancellation as IPickupCancellation, PickupCancellation as PickupCancellationPOJO, PickupCancellationReason, UUID } from "../../../definitions";
import { Address, App, ContactInfo, createNotes, DefinitionIdentifier, hideAndFreeze, Identifiers, Joi, Note, TimeRange, _internal } from "../../common";
import { PickupService } from "./pickup-service";
import { PickupShipment } from "./pickup-shipment";

export class PickupCancellation implements IPickupCancellation {
  public static [_internal] = {
    label: "pickup",
    schema: Joi.object({
      cancellationID: Joi.string().uuid().required(),
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      pickupService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      identifiers: Identifiers[_internal].schema,
      reason: Joi.string().enum(PickupCancellationReason).required(),
      notes: Note[_internal].notesSchema,
      address: Address[_internal].schema.required(),
      contact: ContactInfo[_internal].schema.required(),
      timeWindows: Joi.array().min(1).items(TimeRange[_internal].schema).required(),
      shipments: Joi.array().min(1).items(PickupShipment[_internal].schema).required(),
      metadata: Joi.object(),
    }),
  };

  public cancellationID: UUID;
  public id: string;
  public identifiers: Identifiers;
  public pickupService: PickupService;
  public reason: PickupCancellationReason;
  public notes: Array<Note>;
  public address: Address;
  public contact: ContactInfo;
  public timeWindows: Array<TimeRange>;
  public shipments: Array<PickupShipment>;
  public metadata: object;

  public constructor(pojo: PickupCancellationPOJO, app: App) {
    this.cancellationID = pojo.cancellationID;
    this.id = pojo.id;
    this.pickupService = app[_internal].references.lookup(pojo.pickupService, PickupService);
    this.identifiers = new Identifiers(pojo.identifiers);
    this.reason = pojo.reason;
    this.notes = createNotes(pojo.notes);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
