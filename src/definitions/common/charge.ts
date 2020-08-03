import type { ChargeType } from "./enums";
import type { MonetaryValue } from "./measures/monetary-value";

/**
 * An itemized charge or credit for a shipment or sales order
 */
export interface Charge {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  name: string;

  /**
   * The type of charge
   */
  type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  amount: MonetaryValue;
}
