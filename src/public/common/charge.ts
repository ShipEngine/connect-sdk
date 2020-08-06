import type { ChargeType } from "./enums";
import type { MonetaryValue, MonetaryValuePOJO } from "./measures/monetary-value";

/**
 * An itemized charge or credit for a shipment or sales order
 */
export interface ChargePOJO {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  name?: string;

  /**
   * The type of charge
   */
  type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  amount: MonetaryValuePOJO;

}

/**
 * An itemized charge or credit for a shipment or sales order
 */
export interface Charge {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  readonly name: string;

  /**
   * The type of charge
   */
  readonly type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  readonly amount: MonetaryValue;
}
