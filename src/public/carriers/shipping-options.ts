/**
 * Shipping options that are specific to the carrier. There is currently only 
 * support for DHL specific shipment options. More universal handling to come 
 * in the future.
 */

export interface ShippingOptions {
  /**
   * What category of dangerous goods(if any) does the shipment contents contain.
   */
  dangerousGoodsCategory?: string;

  /**
   * Indicates if the carrier should bill duties to the sender.
   */
  billDutiesToSender?: boolean;
}