import type { ChargeType } from "./enums";
import type { MonetaryValue, MonetaryValuePOJO } from "./measures/monetary-value";
import type { Note, NotePOJO } from "./note";

/**
 * An itemized charge or credit for a shipment or sales order
 */
export interface ChargePOJO {
  /**
   * The user-friendly name of the charge (e.g. "Fuel Charge", "Oversize Package Fee")
   */
  name?: string;

  /**
   * The carrier's description of the charge, not specific to the user
   */
  // This isn't stored in the platform
  // description?: string;

  /**
   * The carrier's code for this charge
   */
  // This isn't stored in the platform
  // code?: string;

  /**
   * The type of charge
   */
  type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  // Note: All charges on an order must be in the same currency
  amount: MonetaryValuePOJO;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  // Notes aren't associated with charges in the platform
  // notes?: string | ReadonlyArray<string | NotePOJO>;
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
   * The carrier's description of the charge, not specific to the user
   */
  readonly description: string;

  /**
   * The carrier's code for this charge
   */
  readonly code: string;

  /**
   * The type of charge
   */
  readonly type: ChargeType;

  /**
   * The amount of the charge (negative amount for a credit)
   */
  readonly amount: MonetaryValue;

  /**
   * Human-readable information regarding this charge, such as an explanation or reference number
   */
  readonly notes: ReadonlyArray<Note>;
}
