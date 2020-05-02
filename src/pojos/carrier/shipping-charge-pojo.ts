import { ShippingChargeType } from "../../enums";
import { MonetaryValuePOJO } from "../common";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export interface ShippingChargePOJO {
  name?: string;
  type: ShippingChargeType;
  amount: MonetaryValuePOJO;
}
