import { TimeRangePOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../common/internal";
import { TimeRange, TimeRangeBase } from "../common/measures/time-range";

/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrderTimeRangePOJO extends TimeRangePOJO {
  /**
   * Indicates whether orders that were modified during the date/time range should be returned.
   * If `false` (the default), then only orders that were *created* durng the date/time are returned.
   */
  includeChanges?: boolean;
}


/**
 * Specifies a date/time range to retrieve sales orders for
 */
export class SalesOrderTimeRange extends TimeRangeBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "time range",
    schema: TimeRange[_internal].schema.keys({
      includeChanges: Joi.boolean(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates whether orders that were modified during the date/time range should be returned.
   * If `false` (the default), then only orders that were *created* durng the date/time are returned.
   */
  public readonly includeChanges: boolean;

  //#endregion

  public constructor(pojo: SalesOrderTimeRangePOJO) {
    super(pojo);

    this.includeChanges = pojo.includeChanges || false;

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(TimeRange);
