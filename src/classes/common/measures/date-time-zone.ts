import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { IdentifierPOJO } from "../../../pojos/common";

/**
 * A date/time in a specific time zone. The time zone may be a UTC offset (e.g. "+05:30")
 * or an IANA time zone (e.g. "America/Los_Angeles", "Asia/Tokyo").
 *
 * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
 */
export class DateTimeZone {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "date/time",
    schema: Joi.alternatives(
      Joi.date(),
      Joi.string().isoDateTime({ timeZone: true }),
      Joi.object({
        value: Joi.string().isoDateTime({ timeZone: false }).required(),
        timeZone: Joi.string().timeZone().required(),
      })
    ),
  };

  //#endregion
  //#region Public Fields

  public readonly id: string;
  public readonly name: string;

  //#endregion

  public constructor(pojo: IdentifierPOJO) {
    this.id = pojo.id;
    this.name = pojo.name;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(DateTimeZone);
