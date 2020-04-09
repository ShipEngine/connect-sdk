import { ShippingChargeType } from "../enums";
import { MonetaryValueConfig } from "./measures-config";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export interface ShippingChargeConfig {
  type: ShippingChargeType;
  amount: MonetaryValueConfig;
  description?: string;
}
