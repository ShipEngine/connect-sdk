import { AddressPOJO, ContactInfoPOJO, NotePOJO, PickupCancellation as IPickupCancellation, PickupCancellationReason, TimeRangePOJO, UUID } from "../../../public";
import { Address, App, ContactInfo, DefinitionIdentifier, hideAndFreeze, Identifiers, Joi, Note, TimeRange, _internal, IdentifiersPOJO } from "../../common";
import { PickupService, PickupServiceIdentifierPOJO } from "./pickup-service";
import { PickupShipment, PickupShipmentPOJO } from "./pickup-shipment";

export interface PickupCancellationPOJO {
  cancellationID: UUID;
  id: string;
  identifiers?: IdentifiersPOJO;
  pickupService: PickupServiceIdentifierPOJO | string;
  reason: PickupCancellationReason;
  notes?: readonly NotePOJO[];
  address: AddressPOJO;
  contact: ContactInfoPOJO;
  timeWindows: readonly TimeRangePOJO[];
  shipments: readonly PickupShipmentPOJO[];
  metadata?: object;
}


export class PickupCancellation implements IPickupCancellation {
  public static readonly [_internal] = {
    label: "pickup",
    schema: Joi.object({
      cancellationID: Joi.string().uuid().required(),
      id: Joi.string().trim().singleLine().min(1).required(),
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

  public readonly cancellationID: UUID;
  public readonly id: string;
  public readonly identifiers: Identifiers;
  public readonly pickupService: PickupService;
  public readonly reason: PickupCancellationReason;
  public readonly notes: readonly Note[];
  public readonly address: Address;
  public readonly contact: ContactInfo;
  public readonly timeWindows: readonly TimeRange[];
  public readonly shipments: readonly PickupShipment[];
  public readonly metadata: object;

  public constructor(pojo: PickupCancellationPOJO, app: App) {
    this.cancellationID = pojo.cancellationID;
    this.id = pojo.id;
    this.pickupService = app[_internal].references.lookup(pojo.pickupService, PickupService);
    this.identifiers = new Identifiers(pojo.identifiers);
    this.reason = pojo.reason;
    this.notes = pojo.notes || [];
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.timeWindows = pojo.timeWindows.map((window) => new TimeRange(window));
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
