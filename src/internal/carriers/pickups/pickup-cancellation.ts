import { PickupCancellation as IPickupCancellation, PickupCancellationPOJO, PickupCancellationReason, UUID } from "../../../public";
import { Address, App, ContactInfo, createNotes, DefinitionIdentifier, hideAndFreeze, Identifiers, Joi, Note, TimeRange, _internal } from "../../common";
import { PickupService } from "./pickup-service";
import { PickupShipment } from "./pickup-shipment";

export class PickupCancellation implements IPickupCancellation {
  public static readonly [_internal] = {
    label: "pickup",
    schema: Joi.object({
      cancellationID: Joi.string().uuid().required(),
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      pickupService: DefinitionIdentifier[_internal].schema.unknown(true).required(),
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

  public readonly cancellationID: UUID;
  public readonly id: string;
  public readonly identifiers: Identifiers;
  public readonly pickupService: PickupService;
  public readonly reason: PickupCancellationReason;
  public readonly notes: ReadonlyArray<Note>;
  public readonly address: Address;
  public readonly contact: ContactInfo;
  public readonly timeWindows: ReadonlyArray<TimeRange>;
  public readonly shipments: ReadonlyArray<PickupShipment>;
  public readonly metadata: object;

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
