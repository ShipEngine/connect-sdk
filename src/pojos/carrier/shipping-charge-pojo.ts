import { ShippingChargeType } from "../../enums";
import { MonetaryValuePOJO } from "../measures-pojo";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export interface ShippingChargePOJO {
  type: ShippingChargeType;
  amount: MonetaryValuePOJO;
  description?: string;
}
