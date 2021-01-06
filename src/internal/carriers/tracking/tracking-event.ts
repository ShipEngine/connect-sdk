import { ShipmentStatus, TrackingEvent as TrackingEventPOJO } from "../../../public";
import { DateTimeZone, hideAndFreeze, Joi, Note, PartialAddress, PersonName, _internal } from "../../common";

export class TrackingEvent {
  public static readonly [_internal] = {
    label: "tracking event",
    schema: Joi.object({
      name: Joi.string().singleLine().allow(""),
      dateTime: DateTimeZone[_internal].schema.required(),
      status: Joi.string().enum(ShipmentStatus).required(),
      isError: Joi.boolean(),
      code: Joi.string().singleLine().allow(""),
      description: Joi.string().singleLine().allow(""),
      address: PartialAddress[_internal].schema,
      signer: PersonName[_internal].schema,
      notes: Note[_internal].notesSchema,
    }),
  };

  public readonly name: string;
  public readonly dateTime: DateTimeZone;
  public readonly status: ShipmentStatus;
  public readonly isError: boolean;
  public readonly code: string;
  public readonly description: string;
  public readonly address?: PartialAddress;
  public readonly signer?: PersonName;
  public readonly notes: readonly Note[];

  public constructor(pojo: TrackingEventPOJO) {
    this.name = pojo.name || "";
    this.dateTime = new DateTimeZone(pojo.dateTime);
    this.status = pojo.status;
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.isError = pojo.isError || false;
    this.address = pojo.address && new PartialAddress(pojo.address);
    this.signer = pojo.signer ? new PersonName(pojo.signer) : undefined;
    this.notes = pojo.notes || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
