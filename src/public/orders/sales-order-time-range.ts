import type { TimeRange, TimeRangePOJO } from "../common";

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
export interface SalesOrderTimeRange extends TimeRange {
  /**
   * Indicates whether orders that were modified during the date/time range should be returned.
   * If `false` (the default), then only orders that were *created* durng the date/time are returned.
   */
  readonly includeChanges: boolean;
}
