import { MonetaryValuePOJO } from "../common";
import { ShippingChargeType } from "./enums";

/**
 * An itemized shipping charge in the total cost of a shipment
 */
export interface ShippingChargePOJO {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  name?: string;

  /**
   * The carrier's description of the charge, not specific to the user
   */
  description?: string;

  /**
   * The carrier's code for this charge
   */
  code?: string;

  /**
   * The type of charge
   */
  type: ShippingChargeType;

  /**
   * The amount of the charge
   */
  amount: MonetaryValuePOJO;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  note?: string;
}
