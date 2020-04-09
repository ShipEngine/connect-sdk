import { LabelConfig } from "./label-config";
import { ShippingChargeConfig } from "./shipping-charge-config";

/**
 * Confirms the successful creation of a shipping label
 */
export interface LabelConfirmationConfig {
  /**
   * The carrier's confirmation ID for this transaction
   */
  confirmationID?: string;

  /**
   * The master tracking number for the entire shipment.
   * For single-piece shipments, this will be the same as the label tracking number.
   * For multi-piece shipments, this may be a separate tracking number, or the same
   * tracking number as one of the packages.
   */
  shipmentTrackingNumber?: string;

  /**
   * The estimated date and time for when the shipment will be delivered.
   */
  estimatedDeliveryDateTime?: Date;

  /**
   * The breakdown of charges in the total shipping cost for this label.
   * If the carrier does not provide a detailed breakdown, then just use a single
   * charge of type "shipping".
   */
  charges: ShippingChargeConfig[];

  /**
   * The shipping labels that were created
   */
  labels: LabelConfig[];
}
