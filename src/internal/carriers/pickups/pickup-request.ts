import { AddressPOJO, ContactInfoPOJO, NotePOJO, PickupRequest as IPickupRequest, TimeRangePOJO } from "../../../public";
import { Address, App, ContactInfo, DefinitionIdentifier, hideAndFreeze, Joi, Note, TimeRange, _internal } from "../../common";
import { PickupService, PickupServiceIdentifierPOJO } from "./pickup-service";
import { PickupShipment, PickupShipmentPOJO } from "./pickup-shipment";

export interface PickupRequestPOJO {
  pickupService: PickupServiceIdentifierPOJO | string;
  timeWindow: TimeRangePOJO;
  address: AddressPOJO;
  contact: ContactInfoPOJO;
  notes?: readonly NotePOJO[];
  shipments: readonly PickupShipmentPOJO[];
}

export class PickupRequest implements IPickupRequest {
  public static readonly [_internal] = {
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

  public readonly pickupService: PickupService;
  public readonly timeWindow: TimeRange;
  public readonly address: Address;
  public readonly contact: ContactInfo;
  public readonly notes: readonly Note[];
  public readonly shipments: readonly PickupShipment[];

  public constructor(pojo: PickupRequestPOJO, app: App) {
    this.pickupService = app[_internal].references.lookup(pojo.pickupService, PickupService);
    this.timeWindow = new TimeRange(pojo.timeWindow);
    this.address = new Address(pojo.address);
    this.contact = new ContactInfo(pojo.contact);
    this.notes = pojo.notes || [];
    this.shipments = pojo.shipments.map((shipment) => new PickupShipment(shipment, app));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
