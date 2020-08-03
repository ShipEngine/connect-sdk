import type { TimeRange } from "../common";


export interface SalesOrderPaging {
  /** The desired maximum number of items to return */
  pageSize: number;

  /** The desired page number to return */
  pageNumber: number;

  /** The desired maximum number of pages to return */
  pageCount?: number;

  /** Identifies the next page of results to return */
  cursor?: string;
}

/**
 * Specifies a date/time range to retrieve sales orders for
 */
export interface SalesOrderTimeRange extends TimeRange {
  /**
   * Indicates whether orders that were modified during the date/time range should be returned.
   * If `false` (the default), then only orders that were *created* durng the date/time are returned.
   */
  includeChanges: boolean;

  paging?: Readonly<SalesOrderPaging>;
}
