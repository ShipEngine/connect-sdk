import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { TrackingCriteriaPOJO } from "../../../pojos/carrier";

/**
 * An event or status change that occurred while processing a shipment
 */
export class TrackingEvent {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "tracking event",
    schema: Joi.object({

    }),
  };

  //#endregion
  //#region Public Fields


  //#endregion

  public constructor(pojo: TrackingCriteriaPOJO) {

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TrackingEvent);
