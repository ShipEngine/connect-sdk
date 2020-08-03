import { PickupRequest as IPickupRequest, PickupRequest as PickupRequestPOJO } from "../../../definitions";
import { Address, App, ContactInfo, createNotes, DefinitionIdentifier, hideAndFreeze, Joi, Note, TimeRange, _internal } from "../../common";
import { PickupService } from "./pickup-service";
import { PickupShipment } from "./pickup-shipment";

export class PickupRequest implements IPickupRequest {
  public static [_internal] = {
    label: "pickup request",
    schema: Joi.object({
      pickupService: Joi.alternatives(
        DefinitionIdentifier[_internal].schema.unknown(true),
        Joi.string()
      ).required(),
      timeWindow: TimeRange[_internal].schema.required(),
      address: Address[_internal].schema.required(),
      contact: ContactInfo[_internal].schema.required(),
      notes: Note[_internal].notesSchema,
      shipments: Joi.array().min(1).items(PickupShipment[_internal].schema).required(),
    }),
  };

  public pickupService: PickupService;
  public timeWindow: TimeRange;
  public address: Address;
  public contact: ContactInfo;
  public notes: Array<Note>;
  public shipments: Array<PickupShipment>;

  public constructor(pojo: PickupRequestPOJO, app: App) {
    this.pickupService = app[_internal].references.lookup(pojo.pickupService, PickupService);
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.notes = createNotes(pojo.notes);
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
