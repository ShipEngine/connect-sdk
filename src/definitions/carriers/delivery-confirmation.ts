import type { DefinitionIdentifier, DeliveryConfirmationType } from "../common";

/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifier = DefinitionIdentifier;


/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmation extends DefinitionIdentifier {
  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  description: string;

  /**
   * The type of confirmation
   */
  type: DeliveryConfirmationType;
}
