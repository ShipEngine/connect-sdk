import type { Definition, DefinitionIdentifier, DeliveryConfirmationType } from "../common";


/**
 * A delivery confirmation option offered by a carrier
 */
export interface DeliveryConfirmationDefinition extends Definition {
  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  description?: string;

  /**
   * The type of confirmation
   */
  type: DeliveryConfirmationType;

}


/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifier = DefinitionIdentifier;


/**
 * Identifies a delivery confirmation option offered by a carrier
 */
export type DeliveryConfirmationIdentifierPOJO = Definition;


/**
 * Delivery confirmation options offered by a carrier
 */
export interface DeliveryConfirmation extends DeliveryConfirmationIdentifier {
  /**
   * The user-friendly name for this delivery confirmation (e.g. "Adult Signature", "Authority to Leave")
   */
  readonly name: string;

  /**
   * A short, user-friendly description of the delivery confirmation type
   */
  readonly description: string;

  /**
   * The type of confirmation
   */
  type: DeliveryConfirmationType;
}
